import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CartItems } from "./CartItems";
import { CustomerUserWishlist } from "./CustomerUserWishlist";
import { OrderItems } from "./OrderItems";
import { Category } from "./Category";
import { File } from "./File";
import { ProductCollection } from "./ProductCollection";
import { ProductImage } from "./ProductImage";

@Index("Product_Name_Active_idx", ["active", "name"], { unique: true })
@Index("Product_SKU_Active_idx", ["active", "sku"], { unique: true })
@Index("Product_pkey", ["productId"], { unique: true })
@Entity("Product", { schema: "dbo" })
export class Product {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ProductId" })
  productId: string;

  @Column("character varying", { name: "SKU", nullable: true })
  sku: string | null;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("character varying", { name: "ShortDesc" })
  shortDesc: string;

  @Column("numeric", { name: "Price", default: () => "0" })
  price: string;

  @Column("numeric", { name: "DiscountPrice", default: () => "0" })
  discountPrice: string;

  @Column("numeric", { name: "Size", default: () => "0" })
  size: string;

  @Column("character varying", { name: "LongDesc" })
  longDesc: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("character varying", { name: "Color", nullable: true })
  color: string | null;

  @Column("character varying", { name: "GiftAddOnsAvailable", nullable: true })
  giftAddOnsAvailable: string | null;

  @Column("character varying", { name: "DiscountTagsIds", nullable: true })
  discountTagsIds: string | null;

  @Column("numeric", { name: "Interested", nullable: true, default: () => "0" })
  interested: string | null;

  @OneToMany(() => CartItems, (cartItems) => cartItems.product)
  cartItems: CartItems[];

  @OneToMany(
    () => CustomerUserWishlist,
    (customerUserWishlist) => customerUserWishlist.product
  )
  customerUserWishlists: CustomerUserWishlist[];

  @OneToMany(() => OrderItems, (orderItems) => orderItems.product)
  orderItems: OrderItems[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn([{ name: "CategoryId", referencedColumnName: "categoryId" }])
  category: Category;

  @ManyToOne(() => File, (file) => file.products)
  @JoinColumn([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }])
  thumbnailFile: File;

  @OneToMany(
    () => ProductCollection,
    (productCollection) => productCollection.product
  )
  productCollections: ProductCollection[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  productImages: ProductImage[];
}
