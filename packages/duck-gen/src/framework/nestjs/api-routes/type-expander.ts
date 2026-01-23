
import { Type, Node, Symbol, TypeFormatFlags, SyntaxKind, ts } from 'ts-morph';

export interface ExpandTypeOptions {
    normalizeAnyToUnknown?: boolean;
}

export function expandType(type: Type, node?: Node, options: ExpandTypeOptions = {}, seen = new Map<string, string>()): string {
    // Basic types
    if (type.isString()) return 'string';
    if (type.isNumber()) return 'number';
    if (type.isBoolean()) return 'boolean';
    if (type.isNull()) return 'null';
    if (type.isUndefined()) return 'undefined';

    if (type.isAny()) {
        return options.normalizeAnyToUnknown ? 'unknown' : 'any';
    }
    if (type.isUnknown()) return 'unknown';
    if (type.isVoid()) return 'void';

    // Handle Date
    const symbol = type.getAliasSymbol() || type.getSymbol();
    if (symbol && symbol.getName() === 'Date') {
        return 'Date';
    }

    // Recursion Check (by unique name if available)
    const typeText = type.getText(node, TypeFormatFlags.UseFullyQualifiedType | TypeFormatFlags.NoTruncation);
    if (seen.has(typeText)) {
        return typeText;
    }

    // Handle Arrays - Improved Detection
    // Check if it's an array type OR if it's a type reference to global Array
    if (type.isArray()) {
        const elemType = type.getArrayElementType();
        if (elemType) {
            return `${expandType(elemType, node, options, seen)}[]`;
        }
        return options.normalizeAnyToUnknown ? 'unknown[]' : 'any[]';
    }

    // Fallback for types that look like arrays but are references (e.g. Array<T>)
    // Sometimes isArray() is false for TypeReference to Array?
    if (symbol && symbol.getName() === 'Array') {
        const args = type.getTypeArguments();
        if (args.length > 0) {
            return `${expandType(args[0], node, options, seen)}[]`;
        }
        return options.normalizeAnyToUnknown ? 'unknown[]' : 'any[]';
    }

    // Handle Union
    if (type.isUnion()) {
        const parts = type.getUnionTypes().map(t => expandType(t, node, options, seen));
        return Array.from(new Set(parts)).join(' | ');
    }

    // Handle Objects
    if (type.isObject() || type.isIntersection()) {
        const symName = symbol?.getName();

        // Block expansion of standard library types that might mimic objects
        if (symName === 'Promise') {
            const args = type.getTypeArguments();
            if (args.length > 0) return expandType(args[0], node, options, seen);
            return options.normalizeAnyToUnknown ? 'Promise<unknown>' : 'Promise<any>';
        }

        // Prevent expanding Buffer, Function, etc.
        if (symName === 'Buffer' || symName === 'Function') {
            return symName;
        }

        // Explicitly check if it "looks" like an Array (has numbered index signature and length?)
        // The user saw `__@iterator`. This usually happens when iterating properties of an Array object.
        // If we missed the array check above, we might land here.
        // Let's verify if `type.getApparentType()` has `push`, `pop`, `length`.
        // If so, it's likely an array-like that we should treat as Array<any> or similar fallback if we can't get element type.

        // However, `type.isArray()` should catch it.
        // Maybe it's a `Tuple`?
        if (type.isTuple()) {
            // Expand tuple elements
            const elements = type.getTupleElements();
            const expanded = elements.map(t => expandType(t, node, options, seen));
            return `[${expanded.join(', ')}]`;
        }

        const newSeen = new Map(seen);
        newSeen.set(typeText, typeText);

        const props = type.getProperties();
        if (props.length === 0) {
            const text = type.getText(node, TypeFormatFlags.NoTruncation);
            if (text === '{}') return '{}';
            return text;
        }

        const lines: string[] = [];
        for (const prop of props) {
            // Filter out methods
            const valDeclaration = prop.getValueDeclaration();
            if (valDeclaration && (
                valDeclaration.getKind() === SyntaxKind.MethodDeclaration ||
                valDeclaration.getKind() === SyntaxKind.MethodSignature
            )) {
                continue;
            }

            // Should we filter internal properties starting with __?
            if (prop.getName().startsWith('__')) continue;
            // Filter standard props if we suspect it's looking like an array? 
            // `length`, `toString`, `toLocaleString` are on Object/Array.

            const name = prop.getName();

            // Standard Object methods we don't want in our DTOs
            if (['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'].includes(name)) {
                continue;
            }

            let propType: Type | undefined;
            if (node) {
                propType = prop.getTypeAtLocation(node);
            }

            if (!propType) {
                lines.push(`${name}: any`);
                continue;
            }

            const isOptional = (prop.getFlags() & ts.SymbolFlags.Optional) !== 0;
            const q = isOptional ? '?' : '';

            if (isOptional && propType.isUnion()) {
                const unionTypes = propType.getUnionTypes().filter(t => !t.isUndefined());
                if (unionTypes.length === 1) {
                    propType = unionTypes[0];
                } else {
                    const expandedParts = unionTypes.map(t => expandType(t, node, options, newSeen));
                    const joined = Array.from(new Set(expandedParts)).join(' | ');
                    lines.push(`${name}${q}: ${joined}`);
                    continue;
                }
            }

            const expandedPropType = expandType(propType, node, options, newSeen);
            lines.push(`${name}${q}: ${expandedPropType}`);
        }

        if (lines.length === 0) return '{}';
        return `{ ${lines.join('; ')} }`;
    }

    return type.getText(node, TypeFormatFlags.NoTruncation | TypeFormatFlags.UseFullyQualifiedType);
}
