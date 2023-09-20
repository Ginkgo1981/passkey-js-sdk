import CKB from "@nervosnetwork/ckb-sdk-core";
import { CollectResult, IndexerCapacity, IndexerCell } from "../types/collector";
import axios from "axios";
import { toCamel } from "convert-keys";
import { toCamelcase } from "../utils/case-parser";

export class Collector {
    private ckbNodeUrl: string;
    private ckbIndexerUrl: string;

    constructor({ ckbNodeUrl, ckbIndexerUrl }: { ckbNodeUrl: string, ckbIndexerUrl: string}) {
        this.ckbNodeUrl = ckbNodeUrl;
        this.ckbIndexerUrl = ckbIndexerUrl;
    }

    getCkb() {
        return new CKB(this.ckbNodeUrl);
    }

    async getCells(lock: CKBComponents.Script, type?: CKBComponents.Script): Promise<IndexerCell[] | undefined> {
        const filter = type
        ? {
            script: {
              code_hash: type.codeHash,
              hash_type: type.hashType,
              args: type.args,
            },
          }
        : {
            script: null,
            output_data_len_range: ['0x0', '0x1'],
          }
      let payload = {
        id: 1,
        jsonrpc: '2.0',
        method: 'get_cells',
        params: [
          {
            script: {
              code_hash: lock.codeHash,
              hash_type: lock.hashType,
              args: lock.args,
            },
            script_type: 'lock',
            filter,
          },
          'asc',
          '0x64',
        ],
      }
      const body = JSON.stringify(payload, null, '   ')

      let response = (
        await axios({
            method: 'post',
            url: this.ckbIndexerUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 20000,
            data: body,
        })
      ).data

      if (response.error) {
        throw new Error(response.error.message)
      } else {
        return toCamelcase(response.result.objects)
      }
    }

    collectInputs(liveCells: IndexerCell[], needCapacity: bigint, fee: bigint): CollectResult {
        let inputs: CKBComponents.CellInput[] = []
        let capacity = BigInt(0)
        for (const cell of liveCells) {
          inputs.push({
            previousOutput: cell.outPoint,
            since: '0x0',
          })
          capacity += BigInt(cell.output.capacity)
          if (capacity >= needCapacity + fee) {
            break
          }
        }
        return {
          inputs,
          capacity,
        }
    }

    async getCapacity(lock: CKBComponents.Script): Promise<IndexerCapacity | undefined> {
        let payload = {
          id: 1,
          jsonrpc: '2.0',
          method: 'get_cells_capacity',
          params: [
            {
              script: {
                code_hash: lock.codeHash,
                hash_type: lock.hashType,
                args: lock.args,
              },
              script_type: 'lock',
            },
          ],
        }
        const body = JSON.stringify(payload, null, '  ')
        let response = (
          await axios({
            method: 'post',
            url: this.ckbIndexerUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 20000,
            data: body,
          })
        ).data
        if (response.error) {
          console.error(response.error)
          throw Error('Get cells capacity error')
        } else {
          return toCamelcase(response.result)
        }
    }

    async getLiveCell(outPoint: CKBComponents.OutPoint): Promise<CKBComponents.LiveCell> {
        const ckb = new CKB(this.ckbNodeUrl)
        const { cell } = await ckb.rpc.getLiveCell(outPoint, true)
        return cell
      }
      
}