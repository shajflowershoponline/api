import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerUser } from "./CustomerUser";
import { Discounts } from "./Discounts";

@Index("CustomerCoupon_pkey", ["customerCouponId"], { unique: true })
@Entity("CustomerCoupon", { schema: "dbo" })
export class CustomerCoupon {
  @PrimaryGeneratedColumn({ type: "bigint", name: "CustomerCouponId" })
  customerCouponId: string;

  @Column("timestamp with time zone", {
    name: "CreatedDate",
    default: () => "now()",
  })
  createdDate: Date;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => CustomerUser, (customerUser) => customerUser.customerCoupons)
  @JoinColumn([
    { name: "CustomerUserId", referencedColumnName: "customerUserId" },
  ])
  customerUser: CustomerUser;

  @ManyToOne(() => Discounts, (discounts) => discounts.customerCoupons)
  @JoinColumn([{ name: "DiscountId", referencedColumnName: "discountId" }])
  discount: Discounts;
}
