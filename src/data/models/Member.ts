import { BelongsTo, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Guild } from './Guild';

@Table
export class Member extends Model {

    @Column
    public memberId?: string;

    @BelongsTo(() => Guild)
    @Column
    public guildId?: string;

    @Column
    public score?: number;
}
