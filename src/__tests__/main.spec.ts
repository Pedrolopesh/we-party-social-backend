import supertest from "supertest";

describe("transaction", () => {
  it.skip("should create a transaction register", async () => {
    try {
      const body = {
        zoopId: "1",
        userId: "660c8f0fd26a20dfcca618a9",
        method: "pix",
        status: "open",
        amount: "1",
      };

      const resp = await supertest("http://localhost:8000/api/transaction")
        .post("/create/deposit/pix")
        .send(body);
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  });
  it("should return a transaction", async () => {
    try {
      const params = {
        id: "6643ca25686c8fe1612259a6",
      };

      const resp = await supertest("http://localhost:8000/api/transaction")
        .get("/consult")
        .query(params);
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  });
});
