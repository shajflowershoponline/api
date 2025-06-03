import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { File } from "./File";
import { ProductCollection } from "./ProductCollection";

@Index("Collection_pkey", ["collectionId"], { unique: true })
@Entity("Collection", { schema: "dbo" })
export class Collection {
  @PrimaryGeneratedColumn({ type: "bigint", name: "CollectionId" })
  collectionId: string;

  @Column("bigint", { name: "SequenceId", default: () => "0" })
  sequenceId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("character varying", { name: "Desc" })
  desc: string;

  @Column("boolean", { name: "IsSale", default: () => "false" })
  isSale: boolean;

  @Column("timestamp without time zone", {
    name: "SaleFromDate",
    nullable: true,
  })
  saleFromDate: Date | null;

  @Column("timestamp without time zone", {
    name: "SaleDueDate",
    nullable: true,
  })
  saleDueDate: Date | null;

  @Column("boolean", { name: "Active", nullable: true, default: () => "true" })
  active: boolean | null;

  @Column("character varying", { name: "DiscountTagsIds", nullable: true })
  discountTagsIds: string | null;

  @ManyToOne(() => File, (file) => file.collections)
  @JoinColumn([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }])
  thumbnailFile: File;

  @OneToMany(
    () => ProductCollection,
    (productCollection) => productCollection.collection
  )
  productCollections: ProductCollection[];
}
