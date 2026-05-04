/**
 * Directed Acyclic Graph (DAG) using an Adjacency List.
 * This class handles the item relationships and crafting validation via DFS.
 */
export class Graph {
  constructor() {
    // Adjacency List: key = item ID, value = array of { id: prerequisiteId, count: amountRequired }
    this.adjacencyList = {};
    // Nodes storage for metadata and current inventory
    this.nodes = {};
  }

  /**
   * Adds a vertex to the graph.
   * @param {string} id - Unique identifier for the item.
   * @param {Object} metadata - Display name, tier, icon, etc.
   */
  addNode(id, metadata) {
    if (!this.adjacencyList[id]) {
      this.adjacencyList[id] = [];
      this.nodes[id] = {
        ...metadata,
        id,
        inventoryCount: 0,
      };
    }
  }

  /**
   * Adds a directed edge representing a prerequisite relationship.
   * itemB depends on itemA (itemA -> itemB)
   * @param {string} fromId - The prerequisite item.
   * @param {string} toId - The item being crafted.
   * @param {number} count - Number of prerequisites needed.
   */
  addEdge(fromId, toId, count = 1) {
    if (this.adjacencyList[toId]) {
      this.adjacencyList[toId].push({ id: fromId, count });
    }
  }

  /**
   * Depth-First Search (DFS) to validate prerequisites recursively.
   * Big-O Complexity: O(V + E)
   * 
   * @param {string} itemId - Item to craft.
   * @param {Function} logCallback - Function to send logs to the terminal.
   * @returns {boolean} - Whether crafting is possible.
   */
  validateCraft(itemId, logCallback) {
    logCallback(`> DFS Traversal for ${this.nodes[itemId].name} initiated...`, 'info');

    // Internal recursive DFS helper
    const dfs = (id, depth = 0) => {
      const prerequisites = this.adjacencyList[id];
      const indent = "  ".repeat(depth);

      if (!prerequisites || prerequisites.length === 0) {
        return true;
      }

      let allImmediateMet = true;
      for (const prereq of prerequisites) {
        const prereqNode = this.nodes[prereq.id];
        const hasEnough = prereqNode.inventoryCount >= prereq.count;

        logCallback(`${indent}→ Visiting ${prereqNode.name}...`, 'info');

        if (hasEnough) {
          logCallback(`${indent}  [OK] Stock: ${prereqNode.inventoryCount}/${prereq.count}`, 'success');
        } else {
          logCallback(`${indent}  [FAILED] Stock: ${prereqNode.inventoryCount}/${prereq.count}`, 'error');
          // Only the immediate prerequisites of the item we are CURRENTLY trying to craft
          // should block the crafting process.
          if (depth === 0) {
            allImmediateMet = false;
          }
        }

        // Recursively visit deeper dependencies for visualization purposes
        // This demonstrates the O(V+E) traversal without blocking the game logic
        // if the intermediate component is already in stock.
        dfs(prereq.id, depth + 1);
      }
      return allImmediateMet;
    };

    const result = dfs(itemId);

    if (!result) {
      logCallback(`> Crafting aborted. Prerequisites not met.`, 'error');
    }
    return result;
  }

  /**
   * Subtracts resources and increments the crafted item.
   */
  performCraft(itemId) {
    const prerequisites = this.adjacencyList[itemId];
    prerequisites.forEach(prereq => {
      this.nodes[prereq.id].inventoryCount -= prereq.count;
    });
    this.nodes[itemId].inventoryCount += 1;
  }
}
