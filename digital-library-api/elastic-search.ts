import { Client } from "@elastic/elasticsearch";
import { EDT } from "./edt";
export default class ElasticSearchClient {
  private createConnection = () => {
    return new Client({ node: "http://localhost:9200" });
  };

  createIndex = async (edt: EDT) => {
    const esclient = this.createConnection();
    await esclient.index({
      index: "edt-index",
      id: String(edt.edtid),
      document: edt,
    });
  };

  createBulkIndexes = async (edtArray: EDT[]) => {
    const esclient = this.createConnection();

    await esclient.indices.create(
      {
        index: "edt-index",
      },
      { ignore: [400] }
    );
    const operations = edtArray.flatMap((doc) => [
      { index: { _index: "edt-index" } },
      doc,
    ]);

    const bulkResponse = await esclient.bulk({ refresh: true, operations });

    if (bulkResponse.errors) {
      const erroredDocuments: any = [];
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      bulkResponse.items.forEach((action: any, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            status: action[operation].status,
            error: action[operation].error,
            operation: operations[i * 2],
            document: operations[i * 2 + 1],
          });
        }
      });
      console.log(erroredDocuments);
    }
  };

  searchIndexes = async (query: string) => {
    const esClient = await this.createConnection();
    const results = await esClient.search({
      index: "edt-index",
      size: 1000,
      query: {
        multi_match: {
          query: query,
        },
      },
    });

    console.log(results.hits.hits);

    const response: EDT[] = results.hits.hits.map((item: any) => {
      return item._source;
    });

    return response;
  };
}
