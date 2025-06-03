import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StaffAccess } from "./StaffAccess";

@Index("StaffUser_UserName_Active_idx", ["active", "userName"], {
  unique: true,
})
@Index("StaffUser_pkey", ["staffUserId"], { unique: true })
@Entity("StaffUser", { schema: "dbo" })
export class StaffUser {
  @PrimaryGeneratedColumn({ type: "bigint", name: "StaffUserId" })
  staffUserId: string;

  @Column("character varying", { name: "StaffUserCode", nullable: true })
  staffUserCode: string | null;

  @Column("character varying", { name: "UserName" })
  userName: string;

  @Column("character varying", { name: "Password" })
  password: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("boolean", { name: "AccessGranted", nullable: true })
  accessGranted: boolean | null;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => StaffAccess, (staffAccess) => staffAccess.staffUsers)
  @JoinColumn([
    { name: "StaffAccessId", referencedColumnName: "staffAccessId" },
  ])
  staffAccess: StaffAccess;
}
