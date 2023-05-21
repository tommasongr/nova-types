

**Nova Types** provides a types declaration for the **Nova API** up-to-date with `v10.6`. Future declaration updates will be delivered through this extension.

![](https://raw.githubusercontent.com/tommasongr/nova-types/main/misc/preview.png)

## Requirements

### TypeScript

Even if you can continue to write your Nova extensions in pure JavaScript, Nova Types relies on TypeScript to provide types suggestions. Therefore, make sure to have a TypeScript extension installed as well.

Nova Types has been tested with the following TypeScript extension:

- [TypeScript](nova://extension/?id=apexskier.typescript&name=TypeScript) by Cameron Little

## Usage

To generate Nova Types:

- Select the **Extensions → Nova Types → Generate Types Declaration** menu item; or
- Open the command palette and type `Generate Types Declaration`

> Unless you specify otherwise, Nova Types will **check for updates** any time you open a local project with a previously generated types declaration.

### Configuration

Types definition will be generated in a `/Scripts/types/` folder of your project by default.

You can change this location and other options on a per-project basis in **Project → Project Settings → Nova Types**

## Improving the experience

To get the most out of Nova Types it's highly recommend to add a `jsconfig.json` file with the following configuration to the project:

```json
{
	"compilerOptions": {
		"checkJs": true
	}
}
``` 
