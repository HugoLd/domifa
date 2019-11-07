import { Test, TestingModule } from "@nestjs/testing";
import * as mongoose from "mongoose";
import { DatabaseModule } from "../database/database.module";
import { UsagersModule } from "../usagers/usagers.module";
import { UsersModule } from "../users/users.module";
import { UsersService } from "../users/users.service";
import { InteractionsController } from "./interactions.controller";
import { InteractionDto } from "./interactions.dto";
import { InteractionsProviders } from "./interactions.providers";
import { InteractionsService } from "./interactions.service";

describe("Interactions Controller", () => {
  let app: TestingModule;
  let controller: InteractionsController;
  let userService: UsersService;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [InteractionsController],
      imports: [DatabaseModule, UsersModule, UsagersModule],
      providers: [InteractionsService, ...InteractionsProviders]
    }).compile();
    controller = app.get<InteractionsController>(InteractionsController);

    userService = app.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("GET by ID ", async () => {
    const interaction = new InteractionDto();
    interaction.type = "courrierOut";
    interaction.content = "Les impôts";
    const user = await userService.findOne({ id: 2 });

    try {
      const testFc = await controller.postInteraction(1, interaction, user);
      expect(testFc).toBeDefined();
    } catch (err) {
      expect(err.message).toEqual("NOT_FOUND");
    }

    try {
      expect(
        await controller.postInteraction(100, interaction, user)
      ).toBeDefined();
    } catch (err) {
      expect(err.message).toEqual("NOT_FOUND");
    }
  });
});
