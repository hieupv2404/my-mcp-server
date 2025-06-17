import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { log } from "console";

export interface Env {
	SIM_DUNE_API_KEY: string;
	KAIA_CHAIN_ID: string;
}

// Define our MCP agent with tools
export class MyMCP extends McpAgent<Env> {
	server = new McpServer({
		name: "Authless Calculator",
		version: "1.0.0",
	});
	

	async init() {
		this.server.tool(
			"price token",
			"check the price of the token",
			{ tokenAddress: z.string() },
			async ({ tokenAddress }) => {
				try {
					let apiKey = this.env.SIM_DUNE_API_KEY;
					let kaiaChainId = this.env.KAIA_CHAIN_ID;
					if (!apiKey) {
						throw new Error('SIM_DUNE_API_KEY is not configured');
					}
					if (!kaiaChainId) {
						throw new Error('KAIA_CHAIN_ID is not configured');
					}

					const options = {
						method: 'GET',
						headers: {
							'X-Sim-Api-Key': apiKey
						}
					};

					const response = await fetch(
						`https://api.sim.dune.com/v1/evm/token-info/${tokenAddress}?chain_ids=${kaiaChainId}`,
						options
					);

					if (!response.ok) {
						throw new Error(`API request failed with status ${response.status}`);
					}

					const data = await response.json();
					return {
						content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
					};
				} catch (error) {
					return {
						content: [{ 
							type: "text", 
							text: `Error fetching token data: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		this.server.tool(
			"kaia chain",
			"status of the kaia chain - about: gas, supply, marrket cap, burning, fee",
			async ({}) => {
				try {
					const options = {
						method: 'GET',
					};

					const response = await fetch(
						`https://api-square.kaia.io/api/v1/status/kaia`,
						options
					);

					if (!response.ok) {
						throw new Error(`API request failed with status ${response.status}`);
					}

					const data = await response.json();
					return {
						content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
					};
				} catch (error) {
					return {
						content: [{ 
							type: "text", 
							text: `Error fetching status of kaia chain: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		this.server.tool(
			"total supply kaia",
			"total supply of the kaia chain to make chart",
			{ 
				day: z.number().default(7),
				size: z.number().default(100)
			},
			async ({ day, size }) => {
				try {
					const options = {
						method: 'GET',
					};

					const response = await fetch(
						`https://api-square.kaia.io/api/v1/kaia/supply?from=&days=${day}&size=${size}`,
						options
					);

					if (!response.ok) {
						throw new Error(`API request failed with status ${response.status}`);
					}

					const data = await response.json();
					return {
						content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
					};
				} catch (error) {
					return {
						content: [{ 
							type: "text", 
							text: `Error fetching total supply of kaia chain: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		this.server.tool(
			"transaction info kaia",
			"tx info of the kaia chain to make chart",
			{ 
				day: z.number().default(7),
			},
			async ({ day }) => {
				try {
					const options = {
						method: 'GET',
					};

					const response = await fetch(
						`https://api-square.kaia.io/api/v1/status/tx_info?days=${day}`,
						options
					);

					if (!response.ok) {
						throw new Error(`API request failed with status ${response.status}`);
					}

					const data = await response.json();
					return {
						content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
					};
				} catch (error) {
					return {
						content: [{ 
							type: "text", 
							text: `Error fetching transaction info of kaia chain: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		this.server.tool(
			"accounts count kaia",
			"total accounts count of the kaia chain to make chart",
			{ 
				month: z.number().default(12),
			},
			async ({ month }) => {
				try {
					const options = {
						method: 'GET',
					};

					const response = await fetch(
						`https://api-square.kaia.io/api/v1/status/account?months=${month}`,
						options
					);

					if (!response.ok) {
						throw new Error(`API request failed with status ${response.status}`);
					}

					const data = await response.json();
					return {
						content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
					};
				} catch (error) {
					return {
						content: [{ 
							type: "text", 
							text: `Error fetching accounts count of kaia chain: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		this.server.tool(
			"council members kaia",
			"get all council members of the kaia chain",
			async ({ }) => {
				try {
					const options = {
						method: 'GET',
					};

					const response = await fetch(
						`https://api-square.kaia.io/api/v1/councils?order=staking`,
						options
					);

					if (!response.ok) {
						throw new Error(`API request failed with status ${response.status}`);
					}

					const data = await response.json();
					return {
						content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
					};
				} catch (error) {
					return {
						content: [{ 
							type: "text", 
							text: `Error fetching council member of kaia chain: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		this.server.tool(
			"staking info kaia by council",
			"staking info kaia by council with apy to make chart",
			{ 
				councilId: z.number().default(-1), 
				day: z.number().default(30),
			},
			async ({ councilId, day }) => {
				try {
					const options = {
						method: 'GET',
					};

					const response = await fetch(
						`https://api-square.kaia.io/api/v1/status/staking?cid=${councilId}&days=${day}`,
						options
					);

					if (!response.ok) {
						throw new Error(`API request failed with status ${response.status}`);
					}

					const data = await response.json();
					return {
						content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
					};
				} catch (error) {
					return {
						content: [{ 
							type: "text", 
							text: `Error fetching staking by counctil on kaia chain: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);
		
		// Simple addition tool
		this.server.tool(
			"add",
			{ a: z.number(), b: z.number() },
			async ({ a, b }) => ({
				content: [{ type: "text", text: String(a + b) }],
			})
		);

		this.server.tool(
			"multiply",
			"i want to multiply 2 numbers",
			{ a: z.number(), b: z.number() },
			async ({ a, b }) => ({
				content: [{ type: "text", text: "Here are result: "+ String(a + b) }],
			})
		);

		// Calculator tool with multiple operations
		this.server.tool(
			"calculate",
			{
				operation: z.enum(["add", "subtract", "multiply", "divide"]),
				a: z.number(),
				b: z.number(),
			},
			async ({ operation, a, b }) => {
				let result: number;
				switch (operation) {
					case "add":
						result = a + b;
						break;
					case "subtract":
						result = a - b;
						break;
					case "multiply":
						result = a * b;
						break;
					case "divide":
						if (b === 0)
							return {
								content: [
									{
										type: "text",
										text: "Error: Cannot divide by zero",
									},
								],
							};
						result = a / b;
						break;
				}
				return { content: [{ type: "text", text: String(result) }] };
			}
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
