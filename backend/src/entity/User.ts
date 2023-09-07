import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, OneToMany } from "typeorm"
import { isConstructorDeclaration } from "typescript"
import { UserTechnology } from "./UserTechnology";
import { Reservation } from "./Reservation";
import { Event } from "./Event";
import { EventSpeaker } from "./EventSpeaker";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({
        name: 'id',
        unsigned: true,
        type: 'int',
        comment: 'ユーザーID',
    })
    id: number;

    @Column('varchar', { length: 256, comment: 'ユーザー名' })
    name: string;

    @Column('varchar', { length: 256, comment: 'メールアドレス' })
    email: string;

    @Column('varchar', { length: 256, comment: '部署' })
    department: string;

    @CreateDateColumn({ comment: '登録日時' })
    readonly created_at?: Timestamp;

    @UpdateDateColumn({ comment: '更新日時' })
    readonly edit_at?: Timestamp;

    @OneToMany(() => Reservation, (reservation) => reservation.user, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    readonly reservations?: Reservation[];

    @OneToMany(() => Event, (event) => event.user, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    readonly events?: Event[];

    @OneToMany(() => EventSpeaker, (event_speaker) => event_speaker.user, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    readonly event_speakers?: EventSpeaker[];

    @OneToMany(() => UserTechnology, (user_technology) => user_technology.user, {
        createForeignKeyConstraints: false,
        persistence: false,
        cascade: true
    })
    user_technologies?: UserTechnology[];
}