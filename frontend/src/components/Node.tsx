import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Handle, Position } from "@xyflow/react";

function TextUpdaterNode({ data }) {
  return (
    <div className="w-64 ">
      <Handle type="target" position={Position.Left} />
      <Card className={data.disabled ? "bg-gray-200" : ""}>
        <CardHeader>
          <CardTitle>{data.label}</CardTitle>
          <CardDescription>{data.source}</CardDescription>
        </CardHeader>
      </Card>
      <Handle type="source" position={Position.Right} id="a" />
    </div>
  );
}

export default TextUpdaterNode;
