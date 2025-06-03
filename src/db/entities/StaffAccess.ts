import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StaffUser } from "./StaffUser";

@Index("StaffAccess_Name_Active_idx", ["active", "name"], { unique: true })
@Index("StaffAccess_pkey", ["staffAccessId"], { unique: true })
@Entity("StaffAccess", { schema: "dbo" })
export class StaffAccess {
  @PrimaryGeneratedColumn({ type: "bigint", name: "StaffAccessId" })
  staffAccessId: string;

  @Column("character varying", { name: "StaffAccessCode", nullable: true })
  staffAccessCode: string | null;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("jsonb", { name: "AccessPages", default: [] })
  accessPages: object;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @OneToMany(() => StaffUser, (staffUser) => staffUser.staffAccess)
  staffUsers: StaffUser[];
}
