import React, { useState } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';
import ReactFlow from 'react-flow-renderer';

// Define the graph slice
const graphSlice = createSlice({
  name: 'graph',
  initialState: {
    nodes: [],
    edges: [],
  },
  reducers: {
    addNode: (state, action) => {
      state.nodes.push(action.payload);
    },
    addEdge: (state, action) => {
      state.edges.push(action.payload);
    },
    deleteNode: (state, action) => {
      state.nodes = state.nodes.filter(node => node.id !== action.payload);
    },
    deleteEdge: (state, action) => {
      state.edges = state.edges.filter(edge => edge.id !== action.payload);
    },
    updateNodeLabel: (state, action) => {
      const { nodeId, newLabel } = action.payload;
      const node = state.nodes.find(node => node.id === nodeId);
      if (node) {
        node.data.label = newLabel;
      }
    },
  },
});

// Destructure and export the actions
export const { addNode, addEdge, deleteNode, deleteEdge, updateNodeLabel } = graphSlice.actions;

// Create the Redux store
const store = configureStore({
  reducer: {
    graph: graphSlice.reducer,
  },
});

// Home component
const Home = () => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state.graph);

  const onAddNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: 'New Node' },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
    };
    dispatch(addNode(newNode));
  };

  const onAddEdge = (params) => {
    const newEdge = { id: 'e' + (edges.length + 1), source: params.source, target: params.target, type: 'straight', animated: true };
    dispatch(addEdge(newEdge));
  };

  const onDeleteNode = (nodeId) => {
    dispatch(deleteNode(nodeId));
  };

  const onDeleteEdge = (edgeId) => {
    dispatch(deleteEdge(edgeId));
  };

  const onUpdateNodeLabel = (nodeId, newLabel) => {
    dispatch(updateNodeLabel({ nodeId, newLabel }));
  };

  return (
    <div>
      <button onClick={onAddNode}>Create Node</button>
      <button onClick={() => onDeleteNode('1')}>Delete Node</button> {/* Example usage */}
      {/* Add more buttons or UI elements for other actions as needed */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onAddEdge}
        style={{ width: '100%', height: '90vh' }}
      />
    </div>
  );
};

// App component
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Home />
      </div>
    </Provider>
  );
}

export default App;