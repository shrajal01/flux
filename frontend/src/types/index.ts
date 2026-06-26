export type User = {
  id: number;
  username: string;
  email: string;
};

export type Conversation = {
  id: number;
  name: string | null;
  is_group: boolean;
  other_user_id?: number | null;
  other_username?: string | null;
  created_at: string;
};

export type Message = {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  status: "sent" | "delivered" | "read";
  created_at: string;
};