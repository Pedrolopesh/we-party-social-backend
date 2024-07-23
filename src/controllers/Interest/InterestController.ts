import { HttpRequest, HttpResponse } from "../protocols";
import {
  CreateInterestParams,
  IInterestController,
  IInterestRepository,
  IInterestSearchParams,
  Interest,
} from "./Interest";

export class InterestController implements IInterestController {
  constructor(private readonly interestRepository: IInterestRepository) {}

  async createInterest(
    httpRequest: HttpRequest<CreateInterestParams>
  ): Promise<HttpResponse<Interest>> {
    const { body } = httpRequest;

    if (!body) {
      return Promise.resolve({
        status: 400,
        body: "Body is required",
      });
    }

    const findInterest = await this.interestRepository.searchInterestRepository(
      {
        name: body.name,
      }
    );

    if (findInterest.length > 0) {
      return {
        status: 400,
        body: "Interest already exists",
      };
    }

    return this.interestRepository
      .createInterestRepository(body)
      .then((interest) => ({
        status: 200,
        body: interest,
      }))
      .catch(() => ({
        status: 400,
        body: "Error creating interest",
      }));
  }
  async updateInterest(
    httpRequest: HttpRequest<{ params: any; newInterest: CreateInterestParams }>
  ): Promise<HttpResponse<Interest>> {
    const { body } = httpRequest;

    if (!body) {
      return Promise.resolve({
        status: 400,
        body: "Body is required",
      });
    }

    if (!body.params?.id) {
      return {
        status: 400,
        body: "Id is required",
      };
    }

    return this.interestRepository
      .updateInterestRepository(body.params?.id, body.newInterest)
      .then((interest) => ({
        status: 200,
        body: interest,
      }))
      .catch((err: any) => ({
        status: 400,
        body: err.message,
      }));
  }
  async serachInterest(
    httpRequest: HttpRequest<IInterestSearchParams>
  ): Promise<HttpResponse<Interest | Interest[]>> {
    const { body } = httpRequest;

    if (!body) {
      return Promise.resolve({
        status: 400,
        body: "Body is required",
      });
    }

    const findInterest = await this.interestRepository.searchInterestRepository(
      {
        ...(body.name && { name: body.name }),
        ...(body.id && { id: body.id }),
      }
    );

    if (!findInterest) {
      return {
        status: 400,
        body: "Interest not found",
      };
    }

    return this.interestRepository
      .searchInterestRepository(body)
      .then((interest) => ({
        status: 200,
        body: interest,
      }))
      .catch(() => ({
        status: 400,
        body: "Error searching interest",
      }));
  }

  getAllInterests(
    httpRequest: HttpRequest<IInterestSearchParams>
  ): Promise<HttpResponse<Interest[]>> {
    throw new Error("Method not implemented.");
  }
  async deleteInterest(
    httpRequest: HttpRequest<{ id: string }>
  ): Promise<HttpResponse<Interest | null>> {
    const { body } = httpRequest;

    if (!body) {
      return Promise.resolve({
        status: 400,
        body: "Body is required",
      });
    }

    return this.interestRepository
      .deleteInterestRepository(body.id)
      .then((interest) => ({
        status: 200,
        body: interest,
      }))
      .catch(() => ({
        status: 400,
        body: "Error deleting interest",
      }));
  }
}
