import {
    BaseEdge,
    EdgeLabelRenderer,
    getStraightPath,
    useReactFlow,
    getBezierPath,
  } from '@xyflow/react';
import "@xyflow/react/dist/style.css";
import { XCircleIcon } from '@heroicons/react/24/solid';

  
  export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, style, markerEnd }) {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      }); 
      
      const { stroke = '#000', strokeWidth = 2 } = style || {};

    return (
      <>
        <BaseEdge id={id} path={edgePath} style={{ stroke, strokeWidth }} markerEnd={markerEnd}/>
        <EdgeLabelRenderer>
        <XCircleIcon
          className="h-5 w-5 cursor-pointer text-white bg-black rounded-full"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== id));
          }}
        />
        </EdgeLabelRenderer>
      </>
    );
  }