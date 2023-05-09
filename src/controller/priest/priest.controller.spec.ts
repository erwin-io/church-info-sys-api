import { Test, TestingModule } from '@nestjs/testing';
import { PriestController } from './priest.controller';

describe('PriestController', () => {
  let controller: PriestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriestController],
    }).compile();

    controller = module.get<PriestController>(PriestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
