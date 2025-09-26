"use client";
import { useEffect, useState, useCallback } from "react";
import { createWebSocket } from "@/utils/websocket/ws-client";
import { fetchAccessToken } from "@/lib/auth-tokens";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useChatSocket(contactId: string | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentService, setCurrentService] = useState<any>(null);
  const [allServices, setAllServices] = useState<Map<string, any>>(new Map());
  const [blockedUsers, setBlockedUsers] = useState<Map<string, string>>(new Map());
  const [wsAvailability, setWsAvailability] = useState<Map<string, "locked" | "unlocked">>(new Map());
  const [blockedServiceIds, setBlockedServiceIds] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<
    "connecting..." | "connection open" | "connection closed"
  >("connection closed");
  const { user } = useAuth();

  const resetServiceState = useCallback(() => {
    setCurrentService(null);
    setMessages([]);
    setAllServices(new Map());
    setBlockedUsers(new Map());
    setWsAvailability(new Map());
    setBlockedServiceIds(new Set());
  }, []);

  useEffect(() => {
    if (!contactId) {
      resetServiceState();
      return;
    }

    let disconnect: (() => void) | null = null;

    const connect = async () => {
      setStatus("connecting...");
      console.log('Tentando conectar WebSocket para contactId:', contactId);
      const accessToken = await fetchAccessToken();

      if (!accessToken) {
        setStatus("connection closed");
        return;
      }

      const baseUrl = "ws://localhost:8005/ws";
      const wsChatUrl = `${baseUrl}/chat/${encodeURIComponent(
        contactId
      )}/?token=${accessToken}`;

      disconnect = createWebSocket(
        wsChatUrl,
        (event) => {
          if (event.type === "chat.message") {
            const msg = event.data || event.message;
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
            return;
          }

          if (event.type !== "service.event") return;

          const serviceData = event.data || event;
          if (serviceData.contact_id !== contactId) {
            return;
          }
          console.log(serviceData)

          const serviceId = serviceData.uuid || serviceData.service_id;

          if (serviceData.action === "code_a10000") {
            toast.info("Atendimento iniciado por outro colaborador.");
            setBlockedUsers((prev) => {
              const newMap = new Map(prev);
              newMap.set(serviceData.contact_id, serviceData.user_uuid || "unknown");
              return newMap;
            });
            setWsAvailability((prev) => {
              const m = new Map(prev);
              m.set(serviceData.contact_id, "locked");
              return m;
            });
            setBlockedServiceIds((prev) => {
              const newSet = new Set(prev);
              newSet.add(serviceId);
              return newSet;
            });
            setAllServices((prev) => {
              const newMap = new Map(prev);
              newMap.delete(serviceId);
              return newMap;
            });
            setCurrentService((prev: any) =>
              prev && (prev.uuid === serviceId || prev.service_id === serviceId)
                ? null
                : prev
            );
            setMessages((prev) =>
              prev.filter((msg) => msg.service_id !== serviceId)
            );
            return;
          }

          if (serviceData.action === "code_a20000" || serviceData.action === "finished") {
            if (serviceData.action === "finished" && serviceData.user_name != user?.name) {
              setCurrentService((prev: any) =>
                prev && prev.uuid === serviceId ? null : prev
              );
              toast.success("Contato disponível para novos atendimentos.");
            }
            setBlockedUsers((prev) => {
              const newMap = new Map(prev);
              newMap.delete(serviceData.contact_id);
              return newMap;
            });
            setWsAvailability((prev) => {
              const m = new Map(prev);
              m.set(serviceData.contact_id, "unlocked");
              return m;
            });
            if (serviceData.action === "code_a20000") {
              return toast.success("Contato disponível para novos atendimentos.");
            }
          }

          if (serviceData.action === "code_a40000") {
            setAllServices((prev) => {
              const newMap = new Map(prev);
              newMap.delete(serviceId);
              return newMap;
            });
            setCurrentService((prev: any) =>
              prev && (prev.uuid === serviceId || prev.service_id === serviceId)
                ? null
                : prev
            );
            setMessages((prev) =>
              prev.filter((msg) => msg.service_id !== serviceId)
            );
            return;
          }

          if (serviceData.action === "started" && serviceData.user_name != user?.name) {
            toast.info("Atendimento iniciado por outro colaborador.");
            setBlockedUsers((prev) => {
              const newMap = new Map(prev);
              newMap.set(serviceData.contact_id, serviceData.user_uuid || serviceData.user_name || "unknown");
              return newMap;
            });
            setWsAvailability((prev) => {
              const m = new Map(prev);
              m.set(serviceData.contact_id, "locked");
              return m;
            });
          } if (serviceData.action === "started" && serviceData.user_name === user?.name) {
            // Remove o bloqueio quando o usuário atual inicia o atendimento
            setBlockedUsers((prev) => {
              const newMap = new Map(prev);
              newMap.delete(serviceData.contact_id);
              return newMap;
            });
            setWsAvailability((prev) => {
              const m = new Map(prev);
              m.set(serviceData.contact_id, "unlocked");
              return m;
            });
            // Remove dos serviços bloqueados
            setBlockedServiceIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(serviceId);
              return newSet;
            });
          }

          setAllServices((prev) => {
            const newMap = new Map(prev);
            newMap.set(serviceId, serviceData);
            return newMap;
          });

          const actions = ["transferred", "finished", "dismissed"];
          if (actions.includes(serviceData.action)) {
            setCurrentService((prev: any) =>
              prev && prev.uuid === serviceId ? null : prev
            );
          } else if (
            serviceData.action === "created" &&
            serviceData.status === "pending"
          ) {
            setCurrentService(serviceData);
          } else if (
            serviceData.action === "started" &&
            serviceData.status === "in_progress"
          ) {
            setCurrentService(serviceData);
          } else {
            setCurrentService((prev: any) => {
              if (!prev || prev.uuid !== serviceId) return prev;
              return {
                ...prev,
                ...serviceData,
                uuid: serviceData.uuid || serviceData.service_id || prev.uuid,
                service_id:
                  serviceData.service_id ||
                  serviceData.uuid ||
                  prev.service_id,
              };
            });
          }
        },
        setStatus,
        undefined,
        2000,
        false
      );
    };

    connect();

    return () => {
      if (disconnect) disconnect();
    };
  }, [contactId, resetServiceState]);

  return {
    messages,
    currentService,
    allServices,
    blockedUsers,
    wsAvailability,
    blockedServiceIds,
    status,
  };
}
