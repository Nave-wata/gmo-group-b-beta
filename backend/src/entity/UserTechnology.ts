import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { isConstructorDeclaration } from "typescript"
import { User } from "./User";
import { JoinAttribute } from "typeorm/query-builder/JoinAttribute";
import { Technology } from "./Technology";

@Entity('user_technology')
export class UserTechnology {
    @PrimaryGeneratedColumn({
        name: 'id',
        unsigned: true,
        type: 'int',
        comment: 'ユーザー得意技術ID',
    })
    id: number;

    @ManyToOne(() => User, (user) => user.user_technologies, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'id',
    })
    user?: User;

    @ManyToOne(() => Technology, (technology) => technology.user_technologies, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    @JoinColumn({
        name: 'technology_id',
        referencedColumnName: 'id',
    })
    technology?: Technology;

    @CreateDateColumn({ comment: '登録日時' })
    readonly created_at?: Timestamp;

    @UpdateDateColumn({ comment: '更新日時' })
    readonly edit_at?: Timestamp;
}