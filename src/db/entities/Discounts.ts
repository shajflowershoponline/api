import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerCoupon } from "./CustomerCoupon";
import { File } from "./File";

@Index("Discounts_pkey", ["discountId"], { unique: true })
@Index("Discounts_Name_Type_Active_idx", ["promoCode", "type"], {
  unique: true,
})
@Entity("Discounts", { schema: "dbo" })
export class Discounts {
  @PrimaryGeneratedColumn({ type: "bigint", name: "DiscountId" })
  discountId: string;

  @Column("character varying", { name: "PromoCode" })
  promoCode: string;

  @Column("character varying", { name: "Description", nullable: true })
  description: string | null;

  @Column("character varying", { name: "Type", default: () => "'AMOUNT'" })
  type: string;

  @Column("numeric", { name: "Value", default: () => "0" })
  value: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @OneToMany(() => CustomerCoupon, (customerCoupon) => customerCoupon.discount)
  customerCoupons: CustomerCoupon[];

  @ManyToOne(() => File, (file) => file.discounts)
  @JoinColumn([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }])
  thumbnailFile: File;
}
