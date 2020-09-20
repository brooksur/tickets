import { Publisher, OrderCreatedEvent, Subjects } from '@brooksbenson03-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}