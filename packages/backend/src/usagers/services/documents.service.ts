import { Inject, Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { UsersService } from "../../users/services/users.service";
import { User } from "../../users/user.interface";
import { Doc } from "../interfaces/doc";
import { Usager } from "../interfaces/usagers";

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject("USAGER_MODEL") private readonly usagerModel: typeof Model
  ) {}

  public async deleteDocument(
    usagerId: number,
    index: number,
    user: User
  ): Promise<Usager> {
    const usager = await this.usagerModel
      .findOne({ id: usagerId, structureId: user.structureId })
      .exec();
    const newDocs = usager.docs;
    const newDocsPath = usager.docsPath;
    newDocs.splice(index, 1);
    newDocsPath.splice(index, 1);

    /* GET USER NAME ID */
    return this.usagerModel
      .findOneAndUpdate(
        { id: usagerId, structureId: user.structureId },
        {
          $set: {
            docs: usager.docs,
            docsPath: usager.docsPath
          }
        },
        {
          new: true
        }
      )
      .exec();
  }

  public async addDocument(
    usagerId: number,
    user: User,
    filename: string,
    newDoc: any
  ): Promise<Usager> {
    return this.usagerModel
      .findOneAndUpdate(
        {
          id: usagerId,
          structureId: user.structureId
        },
        {
          $push: { docs: newDoc, docsPath: filename }
        },
        { new: true }
      )
      .select("-docsPath")
      .exec();
  }

  public async getDocument(usager: Usager, index: number): Promise<Doc> {
    if (
      typeof usager.docs[index] === "undefined" ||
      typeof usager.docsPath[index] === "undefined"
    ) {
      return null;
    }

    const fileInfos = usager.docs[index];
    fileInfos.path = usager.docsPath[index];
    return fileInfos;
  }
}
