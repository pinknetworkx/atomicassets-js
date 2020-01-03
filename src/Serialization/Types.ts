import {ITypeParser} from "./TypeParser";
import BooleanParser from "./TypeParser/BooleanParser";
import {ByteParser} from "./TypeParser/ByteParser";
import FixedIntegerParser from "./TypeParser/FixedIntegerParser";
import FloatingParser from "./TypeParser/FloatingParser";
import IPFSParser from "./TypeParser/IPFSParser";
import StringParser from "./TypeParser/StringParser";
import VariableIntegerParser from "./TypeParser/VariableIntegerParser";

// tslint:disable:object-literal-sort-keys
export const ParserTypes: {[id: string]: ITypeParser} = {
    int8: new VariableIntegerParser(1, false, false),
    int16: new VariableIntegerParser(2, false, false),
    int32: new VariableIntegerParser(4, false, false),
    int64: new VariableIntegerParser(8, false, false),

    sint8: new VariableIntegerParser(1, false, true),
    sint16: new VariableIntegerParser(2, false, true),
    sint32: new VariableIntegerParser(4, false, true),
    sint64: new VariableIntegerParser(8, false, true),

    uint8: new VariableIntegerParser(1, true, false),
    uint16: new VariableIntegerParser(2, true, false),
    uint32: new VariableIntegerParser(4, true, false),
    uint64: new VariableIntegerParser(8, true, false),

    fixed8: new FixedIntegerParser(1),
    fixed16: new FixedIntegerParser(2),
    fixed32: new FixedIntegerParser(4),
    fixed64: new FixedIntegerParser(8),

    bool: new BooleanParser(),

    bytes: new ByteParser(),
    string: new StringParser(),

    ipfs: new IPFSParser(),
    float: new FloatingParser(false),
    double: new FloatingParser(true),
};
