import { ITypeParser } from './TypeParser';
import BooleanParser from './TypeParser/BooleanParser';
import { ByteParser } from './TypeParser/ByteParser';
import FixedIntegerParser from './TypeParser/FixedIntegerParser';
import FloatingParser from './TypeParser/FloatingParser';
import IPFSParser from './TypeParser/IPFSParser';
import StringParser from './TypeParser/StringParser';
import VariableIntegerParser from './TypeParser/VariableIntegerParser';

// tslint:disable:object-literal-sort-keys
export const ParserTypes: { [id: string]: ITypeParser } = {
    int8: new VariableIntegerParser(1, false),
    int16: new VariableIntegerParser(2, false),
    int32: new VariableIntegerParser(4, false),
    int64: new VariableIntegerParser(8, false),

    uint8: new VariableIntegerParser(1, true),
    uint16: new VariableIntegerParser(2, true),
    uint32: new VariableIntegerParser(4, true),
    uint64: new VariableIntegerParser(8, true),

    fixed8: new FixedIntegerParser(1),
    fixed16: new FixedIntegerParser(2),
    fixed32: new FixedIntegerParser(4),
    fixed64: new FixedIntegerParser(8),

    bool: new BooleanParser(),

    bytes: new ByteParser(),
    string: new StringParser(),
    image: new StringParser(),

    ipfs: new IPFSParser(),
    float: new FloatingParser(false),
    double: new FloatingParser(true)
};
