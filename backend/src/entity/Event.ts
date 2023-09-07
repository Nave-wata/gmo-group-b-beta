import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, OneToOne, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { isConstructorDeclaration } from "typescript"
import { User } from "./User";
import { JoinAttribute } from "typeorm/query-builder/JoinAttribute";
import { EventSpeaker } from "./EventSpeaker";
import { Reservation } from "./Reservation";
import { EventTechnology } from "./EventTechnology";

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn({
        name: 'id',
        unsigned: true,
        type: 'int',
        comment: 'イベントID',
    })
    readonly id: number;

    @ManyToOne(() => User, (user) => user.events, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    @JoinColumn({
        name: 'create_user_id',
        referencedColumnName: 'id',
    })
    user?: User;

    @Column('varchar', { length: 256, comment: 'イベント名' })
    name: string;

    @Column('timestamp', { comment: '開始日時' })
    start_time: Date;

    @Column('timestamp', { comment: '終了日時' })
    end_time: Date;

    @Column('varchar', { length: 256, comment: '開催場所' })
    location: string;

    @Column('varchar', { length: 1024, comment: 'イベント詳細', nullable: true })
    description: string | null = null;

    @Column('int', { comment: 'イベント詳細', nullable: true })
    limitation: number | null = null;

    @Column('varchar', { length: 256, comment: '資料URL', nullable: true })
    record_url: string | null = null;

    @Column('varchar', { length: 1024, comment: 'GoogleCalenderEventId' })
    google_calender_event_id: string;

    @CreateDateColumn({ comment: '登録日時' })
    readonly created_at?: Timestamp;

    @UpdateDateColumn({ comment: '更新日時' })
    readonly edit_at?: Timestamp;

    @OneToMany(() => EventSpeaker, (event_speaker) => event_speaker.event, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    readonly event_speakers?: EventSpeaker[];

    @OneToMany(() => Reservation, (reservation) => reservation.event, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    readonly reservations?: Reservation[];

    @OneToMany(() => EventTechnology, (event_technology) => event_technology.event, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    event_technologies?: EventTechnology[];
}