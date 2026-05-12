package justserp

type Manifest struct {
	Version   string     `json:"version"`
	BaseURL   string     `json:"baseUrl"`
	Endpoints []Endpoint `json:"endpoints"`
}

type Endpoint struct {
	Key           string      `json:"key"`
	Group         string      `json:"group"`
	GroupLabel    string      `json:"groupLabel"`
	Label         string      `json:"label"`
	Description   string      `json:"description"`
	DocsURL       string      `json:"docsUrl"`
	Method        string      `json:"method"`
	Path          string      `json:"path"`
	RequiredOneOf [][]string  `json:"requiredOneOf,omitempty"`
	Params        []Parameter `json:"params"`
}

type Parameter struct {
	Name        string `json:"name"`
	Label       string `json:"label"`
	Type        string `json:"type"`
	Required    bool   `json:"required"`
	Description string `json:"description,omitempty"`
	Default     any    `json:"default,omitempty"`
	Example     any    `json:"example,omitempty"`
}
