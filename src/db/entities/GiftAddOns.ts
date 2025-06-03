import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { File } from "./File";

@Index("GiftAddOns_Name_Active_idx", ["active", "name"], { unique: true })
@Index("GiftAddOns_pkey", ["giftAddOnId"], { unique: true })
@Entity("GiftAddOns", { schema: "dbo" })
export class GiftAddOns {
  @PrimaryGeneratedColumn({ type: "bigint", name: "GiftAddOnId" })
  giftAddOnId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("character varying", { name: "Description", nullable: true })
  description: string | null;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => File, (file) => file.giftAddOns)
  @JoinColumn([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }])
  thumbnailFile: File;
}
