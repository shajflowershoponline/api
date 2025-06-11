import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CartItems } from "./CartItems";
import { CustomerCoupon } from "./CustomerCoupon";
import { CustomerUserAiSearch } from "./CustomerUserAiSearch";
import { CustomerUserWishlist } from "./CustomerUserWishlist";
import { Order } from "./Order";

@Index("CustomerUser_Active_Email_idx", ["active", "email"], { unique: true })
@Index("CustomerUser_pkey", ["customerUserId"], { unique: true })
@Entity("CustomerUser", { schema: "dbo" })
export class CustomerUser {
  @PrimaryGeneratedColumn({ type: "bigint", name: "CustomerUserId" })
  customerUserId: string;

  @Column("character varying", { name: "CustomerUserCode", nullable: true })
  customerUserCode: string | null;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("character varying", { name: "Email" })
  email: string;

  @Column("character varying", { name: "Password" })
  password: string;

  @Column("character varying", { name: "CurrentOTP", default: () => "0" })
  currentOtp: string;

  @Column("boolean", { name: "IsVerifiedUser", default: () => "false" })
  isVerifiedUser: boolean;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("character varying", { name: "MobileNumber", nullable: true })
  mobileNumber: string | null;

  @Column("character varying", { name: "Address", nullable: true })
  address: string | null;

  @Column("jsonb", { name: "AddressCoordinates", nullable: true })
  addressCoordinates: object | null;

  @Column("character varying", { name: "AddressLandmark", nullable: true })
  addressLandmark: string | null;

  @OneToMany(() => CartItems, (cartItems) => cartItems.customerUser)
  cartItems: CartItems[];

  @OneToMany(
    () => CustomerCoupon,
    (customerCoupon) => customerCoupon.customerUser
  )
  customerCoupons: CustomerCoupon[];

  @OneToMany(
    () => CustomerUserAiSearch,
    (customerUserAiSearch) => customerUserAiSearch.customerUser
  )
  customerUserAiSearches: CustomerUserAiSearch[];

  @OneToMany(
    () => CustomerUserWishlist,
    (customerUserWishlist) => customerUserWishlist.customerUser
  )
  customerUserWishlists: CustomerUserWishlist[];

  @OneToMany(() => Order, (order) => order.customerUser)
  orders: Order[];
}
