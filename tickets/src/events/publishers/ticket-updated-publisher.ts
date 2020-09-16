import { Publisher, Subjects, TicketUpdatedEvent } from '@brooksbenson03-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}