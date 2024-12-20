import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, id: userId }: User,
  ) {
    return this.paymentsService
      .send('create_charge', {
        ...createReservationDto.charge,
      email,
    })
      .pipe(
        map((res) => {
          const reservation = new Reservation({
              ...createReservationDto,
              invoiceId: res.id,
              timestamp: new Date(),
              userId,
          })
          return this.reservationsRepository.create(reservation);
        }),
      );
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(id: number) {
    return this.reservationsRepository.findOne({ id });
  }
  // update
  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      {id},
      updateReservationDto
    )
  }
  // delete 
  async remove(id: number) {
    return this.reservationsRepository.findOneAndDelete({ id })
  }
}
