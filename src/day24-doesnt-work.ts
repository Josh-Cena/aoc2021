// Broken code that OOMs. Enjoy

type Variable = string;

type Instruction = {
  type: "add" | "mul" | "div" | "mod" | "eql";
  op1: Variable;
  op2: Variable | number;
};

type ArithExpr =
  | Variable
  | number
  | {
      type: "add" | "mul" | "div" | "mod";
      op1: ArithExpr;
      op2: ArithExpr;
    };

type Assertion = {
  type: "eq";
  op1: ArithExpr;
  op2: ArithExpr;
};

type GuardedCommand =
  | {
      type: "assume";
      pred: Assertion;
    }
  | {
      type: "havoc";
      var: Variable;
    }
  | {
      type: "assert";
      pred: Assertion;
    }
  | {
      type: "seq";
      cmds: GuardedCommand[];
    }
  | {
      type: "conj";
      op1: GuardedCommand;
      op2: GuardedCommand;
    };

type Condition =
  | {
      type: "eq";
      op1: ArithExpr;
      op2: ArithExpr;
    }
  | {
      type: "impl";
      ops: Condition[];
    }
  | {
      type: "conj";
      op1: Condition;
      op2: Condition;
    }
  | {
      type: "const";
      value: boolean;
    };

function stmtToGuardedCmds(
  stmt: Instruction,
  uniqueId: Map<string, number>,
): GuardedCommand[] {
  const tempVar = `${stmt.op1}_${uniqueId.get(stmt.op1)}`;
  uniqueId.set(stmt.op1, uniqueId.get(stmt.op1)! + 1);
  if (
    stmt.type === "add" ||
    stmt.type === "mul" ||
    stmt.type === "div" ||
    stmt.type === "mod"
  ) {
    // add x y -> Assume x = x_temp; Havoc x; Assume x = x_temp + y
    return [
      {
        type: "assume",
        pred: { type: "eq", op1: stmt.op1, op2: tempVar },
      },
      {
        type: "havoc",
        var: stmt.op1,
      },
      {
        type: "assume",
        pred: {
          type: "eq",
          op1: stmt.op1,
          op2: {
            type: stmt.type,
            op1: tempVar,
            op2: stmt.op2,
          },
        },
      },
    ];
  } else if (stmt.type === "eql") {
    // eql x y -> (Assume x = y; Havoc x; Assume x = 1) AND (Assume x != y; Havoc x; Assume x = 0)
    return [
      {
        type: "conj",
        op1: {
          type: "seq",
          cmds: [
            {
              type: "assume",
              pred: { type: "eq", op1: stmt.op1, op2: stmt.op2 },
            },
            {
              type: "havoc",
              var: stmt.op1,
            },
            {
              type: "assume",
              pred: { type: "eq", op1: stmt.op1, op2: 1 },
            },
          ],
        },
        op2: {
          type: "seq",
          cmds: [
            {
              type: "assume",
              pred: { type: "eq", op1: stmt.op1, op2: stmt.op2 },
            },
            {
              type: "havoc",
              var: stmt.op1,
            },
            {
              type: "assume",
              pred: { type: "eq", op1: stmt.op1, op2: 0 },
            },
          ],
        },
      },
    ];
  } else {
    throw new Error(`Unknown instruction type: ${stmt.type}`);
  }
}

function replaceVar(
  cond: Condition,
  oldVar: Variable,
  newVar: Variable,
): Condition {
  if (cond.type === "eq") {
    return {
      type: "eq",
      op1: cond.op1 === oldVar ? newVar : cond.op1,
      op2: cond.op2 === oldVar ? newVar : cond.op2,
    };
  } else if (cond.type === "impl") {
    return {
      type: "impl",
      ops: cond.ops.map((op) => replaceVar(op, oldVar, newVar)),
    };
  } else if (cond.type === "conj") {
    return {
      type: "conj",
      op1: replaceVar(cond.op1, oldVar, newVar),
      op2: replaceVar(cond.op2, oldVar, newVar),
    };
  } else if (cond.type === "const") {
    return cond;
  } else {
    // @ts-expect-error
    throw new Error(`Unknown condition type: ${cond.type}`);
  }
}

function guardedCmdToWeakestPrecondition(
  cmd: GuardedCommand,
  post: Condition,
  counter: { counter: number },
): Condition {
  switch (cmd.type) {
    case "assume":
      return {
        type: "impl",
        ops: [cmd.pred, ...(post.type === "impl" ? post.ops : [post])],
      };
    case "havoc":
      return replaceVar(post, cmd.var, `${cmd.var}_${counter.counter++}`);
    case "assert":
      return { type: "conj", op1: cmd.pred, op2: post };
    case "seq":
      return cmd.cmds.reduceRight(
        (acc, subCmd) => guardedCmdToWeakestPrecondition(subCmd, acc, counter),
        post,
      );
    case "conj": {
      const pre1 = guardedCmdToWeakestPrecondition(cmd.op1, post, counter);
      const pre2 = guardedCmdToWeakestPrecondition(cmd.op2, pre1, counter);
      return { type: "conj", op1: pre1, op2: pre2 };
    }
  }
}

export function solve1(data: string[]) {
  let curW = 0;
  const uniqueId = new Map<string, number>([
    ["x", 0],
    ["y", 0],
    ["z", 0],
  ]);
  const instructions = data.flatMap((line): Instruction[] => {
    let [type, op1, op2] = line.split(" ");
    if (type === "inp") {
      curW++;
      uniqueId.set(`w${curW}`, 0);
      return [];
    }
    if (op1 === "w") op1 = `w${curW}`;
    if (op2 === "w") op2 = `w${curW}`;
    return [
      {
        type: type as Instruction["type"],
        op1,
        op2: Number.isNaN(Number(op2)) ? op2 : Number(op2),
      },
    ];
  });
  const cmds = instructions.flatMap((stmt) =>
    stmtToGuardedCmds(stmt, uniqueId),
  );
  const program: GuardedCommand[] = [
    ...["x", "y", "z"].map(
      (v): GuardedCommand => ({
        type: "assume",
        pred: { type: "eq", op1: v, op2: 0 },
      }),
    ),
    ...cmds,
    { type: "assert", pred: { type: "eq", op1: "z", op2: 0 } },
  ];
  const counter = { counter: 0 };
  const res = program.reduceRight(
    (acc, subCmd, i) => {
      const pre = guardedCmdToWeakestPrecondition(subCmd, acc, counter);
      console.log(i);
      return pre;
    },
    { type: "const", value: true } as Condition,
  );
  console.log(res);
}
