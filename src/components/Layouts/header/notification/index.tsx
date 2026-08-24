"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { BellIcon } from "./icons";
import { useLongPress } from "@/hooks/use-long-press";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  const { data, mutate, isLoading } = useSWR("/api/user/notifications", fetcher, {
    refreshInterval: 30000, // Poll every 30s
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  const isDotVisible = unreadCount > 0;

  const handleDelete = async (id: string) => {
    if (confirm("এই নোটিফিকেশনটি ডিলিট করতে চান?")) {
      await fetch(`/api/user/notifications/${id}`, { method: "DELETE" });
      mutate(); // Refresh the list
    }
  };

  const handleRead = async (id: string, link?: string | null) => {
    // Mark as read
    await fetch(`/api/user/notifications/${id}`, { method: "PUT" });
    mutate();
    setIsOpen(false);
    if (link) {
      router.push(link);
    }
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger
        className="grid size-12 cursor-pointer place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:focus-visible:border-primary"
        aria-label="View Notifications"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <span className="relative">
          <BellIcon />

          {isDotVisible && (
            <span
              className={cn(
                "absolute top-0 right-0 z-1 size-2 rounded-full bg-red-light ring-2 ring-gray-2 dark:ring-dark-3",
              )}
            >
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-light opacity-75" />
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-stroke bg-white px-3.5 py-3 shadow-md min-[350px]:min-w-[20rem] dark:border-dark-3 dark:bg-gray-dark"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-dark dark:text-white">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="rounded-md bg-primary px-2.25 py-0.5 text-xs font-medium text-white">
              {unreadCount} new
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
        ) : (
          <ul className="mb-3 max-h-92 space-y-1.5 overflow-y-auto">
            {notifications.map((item: any) => (
              <NotificationItem 
                key={item.id} 
                item={item} 
                onDelete={() => handleDelete(item.id)} 
                onClick={() => handleRead(item.id, item.link)}
              />
            ))}
          </ul>
        )}

        <Link
          href="#"
          onClick={() => setIsOpen(false)}
          className="block rounded-lg border border-primary p-2 text-center text-sm font-medium tracking-wide text-primary transition-colors outline-none hover:bg-blue-light-5 focus:bg-blue-light-5 focus:text-primary focus-visible:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-dark-5 dark:hover:bg-dark-3 dark:hover:text-dark-7 dark:focus-visible:border-dark-5 dark:focus-visible:bg-dark-3 dark:focus-visible:text-dark-7"
        >
          See all notifications
        </Link>
      </DropdownContent>
    </Dropdown>
  );
}

// Separate component to easily apply the long-press hook per item
function NotificationItem({ item, onDelete, onClick }: { item: any, onDelete: () => void, onClick: () => void }) {
  const longPressProps = useLongPress(
    () => {
      onDelete();
    },
    () => {
      onClick();
    },
    { delay: 600 }
  );

  return (
    <li role="menuitem" {...longPressProps}>
      <div
        className={cn(
          "flex items-center gap-4 rounded-lg px-2 py-2 cursor-pointer outline-none transition-colors",
          item.isRead 
            ? "hover:bg-gray-2 dark:hover:bg-dark-3" 
            : "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border-l-4 border-primary"
        )}
      >
        <div className="size-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary">
          <BellIcon />
        </div>

        <div>
          <strong className="block text-sm font-medium text-dark dark:text-white">
            {item.title}
          </strong>

          {item.message && (
            <span className="truncate text-xs font-medium text-dark-5 dark:text-dark-6">
              {item.message}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
