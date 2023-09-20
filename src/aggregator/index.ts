import axios from "axios"
import { BaseReq, BaseResp, ExtSubExtSubkeyReq, ExtSubkeyResp } from "../types/joyid"
import { toCamelcase, toSnakeCase } from "../utils/case-parser"

export class Aggregator {
    private url: string

    constructor(url: string) {
        this.url = url
    }

    private async baseRPC(method: string, req: BaseReq | undefined, url = this.url): Promise<BaseResp | undefined> {
        let payload = {
          id: payloadId(),
          jsonrpc: '2.0',
          method,
          params: req ? toSnakeCase(req) : null,
        }
        const body = JSON.stringify(payload, null, '')
        console.log(body)
        try {
          let response = (
            await axios({
              method: 'post',
              url,
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 3000000,
              data: body,
            })
          ).data
          if (response.error) {
            console.error(response)
          } else {
            return toCamelcase(response.result)
          }
        } catch (error) {
          console.error('error', error)
        }
      }

      async generateExtSubkeySmt(extension: ExtSubExtSubkeyReq): Promise<ExtSubkeyResp> {
        return (
          await this.baseRPC('generateExtSubkeySmt', extension)) as Promise<ExtSubkeyResp>
      }

}

const payloadId = () => Date.now()

