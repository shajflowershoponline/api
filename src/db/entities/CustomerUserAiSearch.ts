import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { CustomerUser } from "./CustomerUser";

@Index("CustomerUserAISearch_pkey", ["customerUserAiSearchId"], {
  unique: true,
})
@Entity("CustomerUserAISearch", { schema: "dbo" })
export class CustomerUserAiSearch {
  @Column("uuid", { primary: true, name: "CustomerUserAISearchId" })
  customerUserAiSearchId: string;

  @Column("timestamp with time zone", { name: "DateTime" })
  dateTime: Date;

  @Column("character varying", { name: "Intent" })
  intent: string;

  @Column("jsonb", { name: "Data", default: {} })
  data: object;

  @Column("character varying", { name: "Prompt" })
  prompt: string;

  @Column("text", {
    name: "SuggestionsRelatedCollections",
    array: true,
    default: () => "'{}'[]",
  })
  suggestionsRelatedCollections: string[];

  @Column("text", {
    name: "SuggestionsAvailableColors",
    array: true,
    default: () => "'{}'[]",
  })
  suggestionsAvailableColors: string[];

  @Column("jsonb", { name: "HotPicks", default: [] })
  hotPicks: object;

  @Column("jsonb", { name: "BestSellers", default: [] })
  bestSellers: object;

  @ManyToOne(
    () => CustomerUser,
    (customerUser) => customerUser.customerUserAiSearches
  )
  @JoinColumn([
    { name: "CustomerUserId", referencedColumnName: "customerUserId" },
  ])
  customerUser: CustomerUser;
}
