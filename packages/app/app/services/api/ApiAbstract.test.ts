import { create } from "apisauce"
import { IResponseError } from "tenpercent/shared/src/interfaces/IResponseError"
import { ErrorCode } from "tenpercent/shared/src/types/ErrorCode"
import { ResponseStatusType } from "tenpercent/shared/src/types/ResponseStatusType"
import Utils from "tenpercent/shared/src/Utils"

import { ApiAbstract, DEFAULT_API_CONFIG } from "@/services/api/apiAbstract"
import { GeneralApiProblemKind, getGeneralApiProblem } from "@/services/api/apiProblem"
import { AuthService } from "@/services/AuthService"

// ---- Mocks ----
jest.mock("apisauce", () => ({
  create: jest.fn(),
}))
jest.mock("../services/AuthService")
jest.mock("../utils/Utils")
jest.mock("../utils/getGeneralApiProblem")

const mockPost = jest.fn()
const mockSetHeader = jest.fn().mockReturnValue({ post: mockPost })
;(create as jest.Mock).mockReturnValue({
  post: mockPost,
  setHeader: mockSetHeader,
})

// Simple concrete class to test abstract
class Api extends ApiAbstract {
  public async testPost<T>(url: string) {
    return this.post<T>(url)
  }
}

describe("ApiAbstract", () => {
  let api: Api
  const userId = "123"
  const token = "jwt.token.here"

  beforeEach(() => {
    jest.clearAllMocks()
    ;(AuthService.instance as jest.Mock).mockReturnValue({
      userId,
      token,
      doLogout: jest.fn(),
    })
    api = new Api(DEFAULT_API_CONFIG)
  })

  it("returns Ok when response.ok = true", async () => {
    const mockData = { data: { id: "1" }, status: "ok" }
    mockPost.mockResolvedValueOnce({
      ok: true,
      data: mockData,
    })

    const res = await api.testPost<{ id: string }>("test")

    expect(res.kind).toBe(GeneralApiProblemKind.Ok)
    expect(res.data).toEqual({ id: "1" })
  })

  it("calls refresh if token expired and succeeds", async () => {
    // first response = expired token
    const errors: IResponseError[] = [
      { errorCode: ErrorCode.TOKEN_EXPIRED_ERROR, message: "expired" },
    ]
    mockPost
      .mockResolvedValueOnce({
        ok: false,
        data: { errors },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: { data: { id: "2" } },
      })
    ;(Utils.isArrayNotEmpty as jest.Mock).mockReturnValue(true)
    ;(getGeneralApiProblem as jest.Mock).mockReturnValue(null)

    const res = await api.testPost<{ id: string }>("test")

    expect(res.kind).toBe(GeneralApiProblemKind.Ok)
    expect(res.data).toEqual({ id: "2" })
  })

  it("calls refresh but fails and forces logout", async () => {
    const mockLogout = jest.fn()
    ;(AuthService.instance as jest.Mock).mockReturnValue({
      userId,
      token,
      doLogout: mockLogout,
    })

    const errors: IResponseError[] = [
      { errorCode: ErrorCode.TOKEN_EXPIRED_ERROR, message: "expired" },
    ]
    mockPost.mockResolvedValueOnce({
      ok: false,
      data: { errors },
    })
    ;(Utils.isArrayNotEmpty as jest.Mock).mockReturnValue(true)
    ;(getGeneralApiProblem as jest.Mock).mockReturnValue({
      kind: GeneralApiProblemKind.Unauthorized,
    })

    const res = await api.testPost<{ id: string }>("test")

    expect(mockLogout).toHaveBeenCalled()
    expect(res.kind).toBe(GeneralApiProblemKind.BadData)
  })

  it("returns general problem if not ok and not token error", async () => {
    mockPost.mockResolvedValueOnce({
      ok: false,
      data: { errors: [{ errorCode: "SOME_ERROR", message: "fail" }] },
    })
    ;(Utils.isArrayNotEmpty as jest.Mock).mockReturnValue(true)
    ;(getGeneralApiProblem as jest.Mock).mockReturnValue({ kind: GeneralApiProblemKind.Server })

    const res = await api.testPost("test")

    expect(res.kind).toBe(GeneralApiProblemKind.Server)
  })

  it("returns BadData if retries exhausted", async () => {
    mockPost.mockResolvedValueOnce({ ok: false, data: {} })
    ;(Utils.isArrayNotEmpty as jest.Mock).mockReturnValue(false)
    ;(getGeneralApiProblem as jest.Mock).mockReturnValue(null)

    const res = await api.testPost("test")

    expect(res.kind).toBe(GeneralApiProblemKind.BadData)
    expect(res.status).toBe(ResponseStatusType.INTERNAL)
  })
})
