
/**
 * This is gitpod specific
 */
const appendPort = '8001' + '-';
const base = process.env.GITPOD_WORKSPACE_URL;
const server_url = [base.slice(0, 8), appendPort, base.slice(8)].join('');

export default {
  "fields": {
    "title": "Insider Threat Management ROI Calculator",
    "banner_image": {
      "url": "https://www.observeit.com/wp-content/uploads/2021/03/IRM_Calculator_page_banner_1200x300_v3.jpg",
    },
    "google_api_key": "AIzaSyCd6mEhF440loFFsDj6LkpoORbFgprKM68",
    "google_sheet_id": "1rQI1MHGlxNdbtSjnChCNnjrSJXMuEamyxZ_mJvN-98c",
    "pdf_header_image": {
      "url": "https://www.observeit.com/wp-content/uploads/2021/03/IRM_Calculator_926x183.png",
    },
    "pdf_costs_image": {
      "url": "https://www.observeit.com/wp-content/uploads/2021/03/2020-cost-report.jpg",
    },
    "pdf_analyze_image": {
      "url": "https://www.observeit.com/wp-content/uploads/2021/03/economy_analysis.jpg",
    },
    "pdf_frequency_image": {
      "url": "https://www.observeit.com/wp-content/uploads/2021/03/frequency-chart.jpg",
    },
    "pdf_costs_and_industry_image": {
      "url": "https://www.observeit.com/wp-content/uploads/2021/03/industry-costs.jpg",
    },
    "pdf_key_cost_drivers_image": {
      "url": "https://www.observeit.com/wp-content/uploads/2021/03/key-cost-drivers.jpg",
    },
    "background_color": "",
    "background_image": false,
    "background_size": "cover",
    "background_position": "",
    "background_attachment": "scroll",
    "background_repeat": "no-repeat",
    "color": "",
    "margin": "",
    "padding": "",
    "content_in_container": false
  },
  "attributes": {
    "class": [
      "theme-block",
      "theme-block--roi-calculator",
      "b-roi-calculator",
      "theme-block--full",
      "theme-block--live"
    ],
    "style": [],
    "data-vue-component": "roi-calculator"
  },
  "pdf_endpoint": server_url+"/example/endpoint.php",
  "font_base": "https://www.observeit.com/wp-content/themes/observeit-proofpoint/resources/assets/fonts",
  "nonce": "a0b92aecac",
  "is_preview": false,
  "index": 0
};