import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  idAcceptingMessges?: boolean;
  messages?: Array<Message>;
}
