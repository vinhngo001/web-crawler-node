import fs from "fs";
import path from "path";
import urlParser from "url";
import * as fetch from "node-fetch";
import * as cheerio from "cheerio";

const seenUrls = {};

const getUrl = (link: any, host: any, protocol: any) => {
    if (link.includes('http')) {
        return link;
    } else if (link.startsWith("/")) {
        return `${protocol}//${host}${link}`;
    } else {
        return `${protocol}//${host}/${link}`;
    }
}

const crawl = async ({ url, ignore }) => {
    if (seenUrls[url]) return;
    console.log("crawling...", url);
    seenUrls[url] = true;

    const { host, protocol } = urlParser.parse(url);
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const links = $("a").map((i, link) => link.attribs.href).get();

    const imageUrls = $("img").map((i, link) => link.attribs.src).get();

    imageUrls.forEach((imageUrl) => {
        fetch(getUrl(imageUrl, host, protocol))
            .then((response: any) => {
                const fileName = path.basename(imageUrl);
                if (fileName !== "*") {
                    // console.log({ fileName });
                    const dest = fs.createWriteStream(`images/${fileName}`);
                    response.body.pipe(dest);
                }
            });
    });

    links
        .filter((link) => link.includes(host) && !link.includes(ignore))
        .forEach((link) => {
            crawl({
                url: getUrl(link, host, protocol),
                ignore
            });
        });
}

crawl({
    url: "http://stevescooking.blogspot.com/",
    ignore: "/search",
})