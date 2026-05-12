package justserp

import (
	"fmt"
	"net/url"
	"strconv"
	"strings"
)

func NormalizeParams(endpoint Endpoint, input map[string]any) (url.Values, error) {
	if input == nil {
		input = map[string]any{}
	}

	allowed := make(map[string]Parameter, len(endpoint.Params))
	values := make(url.Values)

	for _, param := range endpoint.Params {
		allowed[param.Name] = param
	}

	for name, raw := range input {
		param, ok := allowed[name]
		if !ok {
			return nil, fmt.Errorf("unknown parameter: %s", name)
		}

		normalized, include, err := normalizeValue(param.Type, raw)
		if err != nil {
			return nil, fmt.Errorf("%s: %w", name, err)
		}
		if include {
			values.Set(name, normalized)
		}
	}

	for _, param := range endpoint.Params {
		if !param.Required {
			continue
		}

		if strings.TrimSpace(values.Get(param.Name)) == "" {
			return nil, fmt.Errorf("missing required parameter: %s", param.Name)
		}
	}

	for _, group := range endpoint.RequiredOneOf {
		found := false
		for _, name := range group {
			if strings.TrimSpace(values.Get(name)) != "" {
				found = true
				break
			}
		}

		if !found {
			return nil, fmt.Errorf("one of these parameters is required: %s", strings.Join(group, ", "))
		}
	}

	return values, nil
}

func normalizeValue(kind string, raw any) (string, bool, error) {
	switch v := raw.(type) {
	case nil:
		return "", false, nil
	case string:
		trimmed := strings.TrimSpace(v)
		if trimmed == "" {
			return "", false, nil
		}
		return normalizeString(kind, trimmed)
	case bool:
		if kind != "boolean" {
			return fmt.Sprintf("%t", v), true, nil
		}
		return strconv.FormatBool(v), true, nil
	case float64:
		if kind == "integer" {
			return strconv.Itoa(int(v)), true, nil
		}
		return fmt.Sprintf("%v", v), true, nil
	case float32:
		if kind == "integer" {
			return strconv.Itoa(int(v)), true, nil
		}
		return fmt.Sprintf("%v", v), true, nil
	case int:
		return strconv.Itoa(v), true, nil
	case int8:
		return strconv.FormatInt(int64(v), 10), true, nil
	case int16:
		return strconv.FormatInt(int64(v), 10), true, nil
	case int32:
		return strconv.FormatInt(int64(v), 10), true, nil
	case int64:
		return strconv.FormatInt(v, 10), true, nil
	case uint:
		return strconv.FormatUint(uint64(v), 10), true, nil
	case uint8:
		return strconv.FormatUint(uint64(v), 10), true, nil
	case uint16:
		return strconv.FormatUint(uint64(v), 10), true, nil
	case uint32:
		return strconv.FormatUint(uint64(v), 10), true, nil
	case uint64:
		return strconv.FormatUint(v, 10), true, nil
	default:
		return "", false, fmt.Errorf("unsupported value type %T", raw)
	}
}

func normalizeString(kind string, value string) (string, bool, error) {
	switch kind {
	case "integer":
		parsed, err := strconv.Atoi(value)
		if err != nil {
			return "", false, fmt.Errorf("must be an integer")
		}
		return strconv.Itoa(parsed), true, nil
	case "boolean":
		parsed, err := strconv.ParseBool(strings.ToLower(value))
		if err != nil {
			return "", false, fmt.Errorf("must be a boolean")
		}
		return strconv.FormatBool(parsed), true, nil
	default:
		return value, true, nil
	}
}
