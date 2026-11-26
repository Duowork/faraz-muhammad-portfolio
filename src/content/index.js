/**
 * Content entry point. Pages read site copy and gallery data from here, never from the
 * JSON files directly, so the source can later move to a CMS or a server loader without
 * touching components.
 *
 * Values in square brackets (e.g. "[YEAR]") are placeholders awaiting the client.
 * `null` URLs fall back to the Instagram profile.
 */
import artData from './art.json';
import siteData from './site.json';
import wearData from './wear.json';
import workData from './work.json';

/**
 * @typedef {object} Room
 * @property {string} number   e.g. "Room 02"
 * @property {string} title    e.g. "Art"
 * @property {string} path     Route of the room, e.g. "/art"
 * @property {string} tagline
 * @property {string} doorImage Image name used on the home-page door tile
 * @property {string} note     Footer note shown in the room
 */

/**
 * @typedef {object} GalleryItem
 * @property {string} slug     URL segment, e.g. "untitled-iv"
 * @property {string} title    Display title, e.g. "untitled iv"
 * @property {string} image    Image name in the manifest (file name without extension)
 * @property {string} alt
 * @property {string} year
 * @property {string | null} instagramUrl
 */

/**
 * @typedef {GalleryItem & { medium: string, dimensions: string }} ArtWork
 * @typedef {GalleryItem & { photographer: string, styling: string, caption: string }} WearLook
 */

/**
 * @typedef {object} Project
 * @property {string} id
 * @property {string} brand
 * @property {string} type     One of `work.projectTypes`
 * @property {string} season
 * @property {string} year
 * @property {string | null} image
 * @property {string} alt
 * @property {string | null} url
 */

export const site = siteData;
export const work = workData;

/** @type {Room} */
export const artRoom = artData.room;
/** @type {ArtWork[]} */
export const artWorks = artData.works;

/** @type {Room} */
export const wearRoom = wearData.room;
/** @type {WearLook[]} */
export const wearLooks = wearData.looks;

/**
 * Index of the item with `slug`, or -1.
 * @param {{ slug: string }[]} items
 * @param {string | undefined} slug
 */
export function findIndexBySlug(items, slug) {
  return items.findIndex((item) => item.slug === slug);
}

/**
 * The item's own Instagram post, or the profile while post URLs are still missing.
 * @param {{ instagramUrl?: string | null, url?: string | null }} item
 */
export function instagramUrlFor(item) {
  return item.instagramUrl ?? item.url ?? site.instagram.url;
}
