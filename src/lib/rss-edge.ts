export interface RSSEdgeItem {
    id: string;
    title: string;
    link: string;
    description: string;
    pubDate: string;
    content?: string;
    contentSnippet?: string;
    source?: string;
}

export interface RSSEdgeFeed {
    title: string;
    items: RSSEdgeItem[];
}

/**
 * A lightweight, Edge-compatible RSS/Atom parser that uses fetch() and regex.
 * Avoids Node.js 'stream' and 'fs' dependencies.
 */
export async function parseRSS(url: string, options: { timeout?: number; userAgent?: string } = {}): Promise<RSSEdgeFeed> {
    const { timeout = 8000, userAgent = 'NovAI-RSS-Parser/1.0' } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': userAgent,
                'Accept': 'application/rss+xml, application/xml, text/xml, */*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const xml = await response.text();
        clearTimeout(timeoutId);

        // Detect if it's Atom or RSS
        if (xml.includes('<feed') && xml.includes('xmlns="http://www.w3.org/2005/Atom"')) {
            return parseAtom(xml);
        } else {
            return parseRSS2(xml);
        }
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

function parseRSS2(xml: string): RSSEdgeFeed {
    const feedTitle = extractTagContent(xml, 'title');
    const items: RSSEdgeItem[] = [];

    // Extract <item> blocks
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1];
        const title = cleanCDATA(extractTagContent(itemXml, 'title'));
        const link = extractTagContent(itemXml, 'link');
        const description = cleanCDATA(extractTagContent(itemXml, 'description') || extractTagContent(itemXml, 'content:encoded') || '');
        const pubDate = extractTagContent(itemXml, 'pubDate') || extractTagContent(itemXml, 'dc:date') || new Date().toISOString();
        const guid = extractTagContent(itemXml, 'guid') || link;

        items.push({
            id: guid,
            title,
            link,
            description,
            pubDate,
            contentSnippet: stripHtml(description).substring(0, 200),
            source: feedTitle
        });
    }

    return { title: feedTitle, items };
}

function parseAtom(xml: string): RSSEdgeFeed {
    const feedTitle = extractTagContent(xml, 'title');
    const items: RSSEdgeItem[] = [];

    // Extract <entry> blocks
    const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null) {
        const entryXml = match[1];
        const title = cleanCDATA(extractTagContent(entryXml, 'title'));

        // Atom links can be complex: <link href="..."/>
        const linkMatch = entryXml.match(/<link[^>]+href=["']([^"']+)["']/);
        const link = linkMatch ? linkMatch[1] : '';

        const summary = cleanCDATA(extractTagContent(entryXml, 'summary') || extractTagContent(entryXml, 'content') || '');
        const updated = extractTagContent(entryXml, 'updated') || extractTagContent(entryXml, 'published') || new Date().toISOString();
        const id = extractTagContent(entryXml, 'id') || link;

        items.push({
            id,
            title,
            link,
            description: summary,
            pubDate: updated,
            contentSnippet: stripHtml(summary).substring(0, 200),
            source: feedTitle
        });
    }

    return { title: feedTitle, items };
}

function extractTagContent(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
}

function cleanCDATA(str: string): string {
    return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}
