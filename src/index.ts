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
    console.log("crawling...", url, "...");
    seenUrls[url] = true;

    const { host, protocol } = urlParser.parse(url);
    const response = await fetch(url);

}