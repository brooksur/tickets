import { Publisher, Subjects, TicketCreatedEvent } from '@brooksbenson03-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}

