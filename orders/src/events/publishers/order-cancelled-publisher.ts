import { Publisher, OrderCancelledEvent, Subjects } from '@brooksbenson03-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}