import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerUser } from "./CustomerUser";
import { Product } from "./Product";

@Index(
  "CustomerUserWishlist_CustomerUserId_ProductId_idx",
  ["customerUserId", "productId"],
  { unique: true }
)
@Index("CustomerUserWishlist_pkey", ["customerUserWishlistId"], {
  unique: true,
})
@Entity("CustomerUserWishlist", { schema: "dbo" })
export class CustomerUserWishlist {
  @PrimaryGeneratedColumn({ type: "bigint", name: "CustomerUserWishlistId" })
  customerUserWishlistId: string;

  @Column("bigint", { name: "CustomerUserId" })
  customerUserId: string;

  @Column("bigint", { name: "ProductId" })
  productId: string;

  @Column("timestamp without time zone", { name: "DateTime" })
  dateTime: Date;

  @ManyToOne(
    () => CustomerUser,
    (customerUser) => customerUser.customerUserWishlists
  )
  @JoinColumn([
    { name: "CustomerUserId", referencedColumnName: "customerUserId" },
  ])
  customerUser: CustomerUser;

  @ManyToOne(() => Product, (product) => product.customerUserWishlists)
  @JoinColumn([{ name: "ProductId", referencedColumnName: "productId" }])
  product: Product;
}
