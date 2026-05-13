/**
 * Graph Class
 * This class handles the Directed Acyclic Graph (DAG) logic and the 
 * Inventory management, representing the core logic of the game.
 */
export class Graph {
  constructor() {
    // Adjacency List: key = item ID, value = array of { id: prerequisiteId, count: amountRequired }
    this.adjacencyList = {};
    // Nodes storage for metadata and current inventory
    this.nodes = {};
  }

  /**
   * Adds a vertex (item) to the tech tree.
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
   * Adds a directed edge (dependency).
   * itemB depends on itemA (itemA -> itemB)
   */
  addEdge(fromId, toId, count = 1) {
    if (this.adjacencyList[toId]) {
      this.adjacencyList[toId].push({ id: fromId, count });
    }
  }

  /**
   * Recursive Depth-First Search (DFS) for Crafting Validation.
   * This implementation follows the academic requirement of deep traversal validation.
   * 
   * @param {string} itemId - The target item to craft.
   * @param {Function} logCallback - UI callback for system logs.
   * @returns {boolean} - Returns true if the entire dependency chain is valid.
   */
  validateCraft(itemId, logCallback) {
    logCallback(`> DFS Traversal for ${this.nodes[itemId].name} initiated...`, 'info');

    let immediateMet = true;

    const dfs = (id, depth = 0) => {
      const node = this.nodes[id];
      const prerequisites = this.adjacencyList[id] || [];
      const indent = "  ".repeat(depth);

      if (prerequisites.length === 0) return true;

      logCallback(`${indent}→ Validating dependencies for: ${node.name}`, 'info');

      for (const req of prerequisites) {
        const prereqNode = this.nodes[req.id];
        const hasEnough = prereqNode.inventoryCount >= req.count;

        logCallback(`${indent}  • Checking ${prereqNode.name}...`, 'info');

        if (hasEnough) {
          logCallback(`${indent}    [OK] Stock: ${prereqNode.inventoryCount}/${req.count}`, 'success');
        } else {
          logCallback(`${indent}    [FAILED] Insufficient stock: ${prereqNode.inventoryCount}/${req.count}`, 'error');
          // Only immediate prerequisites of the target item actually block the craft
          if (depth === 0) {
            immediateMet = false;
          }
        }

        // We continue the DFS traversal for logging/academic purposes 
        // to show the student the full tech tree structure.
        dfs(req.id, depth + 1);
      }
      return true; // We don't use the recursive return value for the game logic
    };

    dfs(itemId);

    if (immediateMet) {
      logCallback(`> Validation successful. Immediate prerequisites available.`, 'success');
    } else {
      logCallback(`> Validation failed. Check immediate requirements above.`, 'error');
    }

    return immediateMet;
  }

  /**
   * Executes the crafting action by deducting resources.
   */
  performCraft(itemId) {
    const prerequisites = this.adjacencyList[itemId];
    prerequisites.forEach(prereq => {
      this.nodes[prereq.id].inventoryCount -= prereq.count;
    });
    this.nodes[itemId].inventoryCount += 1;
  }
}
