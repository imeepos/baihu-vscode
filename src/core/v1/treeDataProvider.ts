
import { join } from 'path';
import { CancellationToken, Event, ProviderResult, TreeDataProvider, TreeItem, Uri } from 'vscode'
export abstract class BaihuItem extends TreeItem {
    parent?: BaihuItem;
    constructor(label: string, desc?: string) {
        super(label);
        if (desc) {
            this.description = desc;
        }
    }
    abstract getChildren(): BaihuItem[];
}

export class DocsAboutUsBaiHuItem extends BaihuItem {
    constructor(parent: BaihuItem) {
        super(`关于作者`);
        this.parent = parent;
        this.iconPath = {
            light: Uri.file(join(__filename, '..', 'resources', 'light/docs.svg')),
            dark: Uri.file(join(__dirname, '..', 'resources', 'dark/docs.svg'))
        }
        this.command = {
            title: `关于作者`,
            command: `baihu.DocsAboutUsWebView`
        }
    }
    getChildren(): BaihuItem[] {
        return []
    }
}
export class DocsBaiHuItem extends BaihuItem {
    constructor() {
        super(`开发文档`, `有问题先看这里`);
        this.iconPath = {
            light: Uri.file(join(__filename, '..', 'resources', 'light/docs.svg')),
            dark: Uri.file(join(__dirname, '..', 'resources', 'dark/docs.svg'))
        }
        this.command = {
            title: `开发文档`,
            command: `baihu.DocsWebView`
        }
    }
    getChildren(): BaihuItem[] {
        return [
            new DocsAboutUsBaiHuItem(this)
        ]
    }
}
export class AppManagerBaiHuItem extends BaihuItem {
    constructor() {
        super(`应用管理`, `保存应用项目以便复用`)
        this.iconPath = {
            light: Uri.file(join(__filename, '..', 'resources', 'light/app.svg')),
            dark: Uri.file(join(__dirname, '..', 'resources', 'dark/app.svg'))
        }
        this.command = {
            title: `应用管理`,
            command: `baihu.AppManagerWebView`
        }
    }
    getChildren(): BaihuItem[] {
        return []
    }
}
export class AstBaiHuItem extends BaihuItem {
    constructor() {
        super(`界面分析`, `用于分析无障碍节点，方便选取`)
        this.iconPath = {
            light: Uri.file(join(__filename, '..', 'resources', 'light/ast.svg')),
            dark: Uri.file(join(__dirname, '..', 'resources', 'dark/ast.svg'))
        }
        this.command = {
            title: `界面分析`,
            command: `baihu.AstWebView`
        }
    }
    getChildren(): BaihuItem[] {
        return []
    }
}

export class TakeScreenBaiHuItem extends BaihuItem {
    constructor() {
        super(`截屏分析`, `用于图色分析`)
        this.iconPath = {
            light: Uri.file(join(__filename, '..', 'resources', 'light/takeScreen.svg')),
            dark: Uri.file(join(__dirname, '..', 'resources', 'dark/takeScreen.svg'))
        }
        this.command = {
            title: `截屏分析`,
            command: `baihu.TakeScreenWebView`
        }
    }
    getChildren(): BaihuItem[] {
        return []
    }
}

export class OcrBaiHuItem extends BaihuItem {
    constructor() {
        super(`OCR分析`, `用于ocr识别分析`)
        this.iconPath = {
            light: Uri.file(join(__filename, '..', 'resources', 'light/ocr.svg')),
            dark: Uri.file(join(__dirname, '..', 'resources', 'dark/ocr.svg'))
        }
        this.command = {
            title: `OCR分析`,
            command: `baihu.OcrWebView`
        }
    }
    getChildren(): BaihuItem[] {
        return []
    }
}

export class ScriptBaiHuItem extends BaihuItem {
    constructor() {
        super(`脚本管理`, `脚本文件管理`)
        this.iconPath = {
            light: Uri.file(join(__filename, '..', 'resources', 'light/script.svg')),
            dark: Uri.file(join(__dirname, '..', 'resources', 'dark/script.svg'))
        }
        this.command = {
            title: `脚本管理`,
            command: `baihu.ScriptWebView`
        }
    }
    getChildren(): BaihuItem[] {
        return []
    }
}

export class LogBaiHuItem extends BaihuItem {
    constructor() {
        super(`运行日志`, `运行日志展示，用于调试`)
        this.iconPath = {
            light: Uri.file(join(__filename, '..', 'resources', 'light/log.svg')),
            dark: Uri.file(join(__dirname, '..', 'resources', 'dark/log.svg'))
        }
        this.command = {
            title: `运行日志`,
            command: `baihu.LogWebView`
        }
    }
    getChildren(): BaihuItem[] {
        return []
    }
}
export class BaihuTreeDataProvider implements TreeDataProvider<BaihuItem> {
    onDidChangeTreeData?: Event<void | BaihuItem | BaihuItem[] | null | undefined> | undefined;
    getTreeItem(element: BaihuItem): TreeItem | Thenable<TreeItem> {
        return element;
    }
    getChildren(element?: BaihuItem | undefined): ProviderResult<BaihuItem[]> {
        if (element) {
            return element.getChildren()
        }
        return [
            new AstBaiHuItem(),
            new TakeScreenBaiHuItem(),
            new OcrBaiHuItem(),
            new AppManagerBaiHuItem(),
            new ScriptBaiHuItem(),
            new LogBaiHuItem(),
            new DocsBaiHuItem(),
        ]
    }
    getParent?(element: BaihuItem): ProviderResult<BaihuItem> {
        return element.parent;
    }
    resolveTreeItem?(item: TreeItem, element: BaihuItem, token: CancellationToken): ProviderResult<TreeItem> {
        return;
    }
}