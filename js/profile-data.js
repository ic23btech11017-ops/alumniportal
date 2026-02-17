/**
 * profile-data.js
 * Mock database of alumni profiles for the public view.
 */

window.ALUMNI_DATA = {
    "rajesh": {
        name: "Rajesh Kumar",
        role: "Senior Systems Architect",
        company: "Google",
        location: "San Francisco, CA",
        batch: "Class of 1998",
        branch: "Computer Science",
        about: "Architecting scalable distributed systems at Google. Passionate about cloud infrastructure, Kubernetes, and open-source technologies. Previously worked at Oracle and Sun Microsystems.",
        skills: ["System Design", "Kubernetes", "Go", "Cloud Architecture"],
        email: "rajesh.kumar@example.com",
        linkedin: "linkedin.com/in/rajeshkumar",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdc78dM0OdKruxYXQFeu_rL8gfZ2Lj8K9Uez5wU3hcWN1rENDpOVfG-YboBxGXSU8Yw9g4omog8GZc7mueTtSrTx3eRoUcCg_sQvZTLosuF3BLgAyyMpaqNjaRMheBH5KrewnSvyLJLmsZ1wglTBdh9aKPQHNrnop0PbU89wckquRsdRhE0z-I7nrfhLiz3ts5Wc3wuI6Wn1DJEhDOxkyDg7cvzN43v8kJ1MtHgplggo9hcR4H8HgMAmTQbOWhq8BsbLenXdhYu6Q",
        cover: "var(--primary-dark)", // Use CSS variable or image URL
        experience: [
            { role: "Senior Systems Architect", company: "Google", duration: "2015 – Present" },
            { role: "Staff Engineer", company: "Oracle", duration: "2008 – 2015" }
        ]
    },
    "michael": {
        name: "Michael Chen",
        role: "Director of Infrastructure",
        company: "Amazon AWS",
        location: "Seattle, WA",
        batch: "Class of 2001",
        branch: "Electrical Engineering",
        about: "Leading infrastructure teams at AWS. Expert in high-availability systems and data center operations. Mentor for early-career engineers.",
        skills: ["Infrastructure", "AWS", "Leadership", "Data Centers"],
        email: "michael.chen@example.com",
        linkedin: "linkedin.com/in/michaelchen",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_nzPqy2crpXxFFJ9t1AGeZaKw5nTj_TIlyz_djzfhTzcpvveMSN_JMJTl6zBomxkYTqGHWO7j5eHtiNYrFOvl8sN_ERp-sNI0SunRNvcotiQ-TCOMYwWBlaFaz3RKhNI7HmuIM0l888yCtLbsj_wgqMv6fkkuDr6ikRE5d3zQBB-0PscWNLoEyW1hDm2ZYLLTmUT0GseC1GZv-nlSv-ID13oZVi9mSnAohQQW1DEoHraEXPYQEtu253FWj_0WhSPgZohFT1lDt0E",
        experience: [
            { role: "Director of Infrastructure", company: "Amazon AWS", duration: "2018 – Present" },
            { role: "Sr. Manager", company: "Amazon", duration: "2010 – 2018" }
        ]
    },
    "anita": {
        name: "Anita Desai",
        role: "Civil Engineer Lead",
        company: "Bechtel Corp",
        location: "Dubai, UAE",
        batch: "Class of 2010",
        branch: "Civil Engineering",
        about: "Specializing in large-scale urban infrastructure projects in the Middle East. Focused on sustainable construction materials and smart city integration.",
        skills: ["Civil Engineering", "Project Management", "AutoCAD", "Sustainability"],
        email: "anita.desai@example.com",
        linkedin: "linkedin.com/in/anitadesai",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfFSqIfRcvHYXfB9r4MhiNPv_e8Y6RPQC7Nrs0hMsxCJp8jmOoiQCbGBhVCEOEI4fWRm6k6VcxDpb6DVpt3HnM5B0ndxwlKCtQ79X2AewZFOcCHTfWuHlnL1Ccpvyw2BpXia_mWcfHy4msLLaz5Rbg_AaUbLlTfJYkrzvzu1Z0ixg5SL0b9SAW2eOT_wZfx6ZwgTaSCj7guXfZLFGimShQGEIwW2hWf2aXpLsR34FVmQmGz9pyA9oLpSdQW6qM13sJn6Rqup1n54w",
        experience: [
            { role: "Civil Engineer Lead", company: "Bechtel Corp", duration: "2016 – Present" },
            { role: "Site Engineer", company: "Larsen & Toubro", duration: "2010 – 2016" }
        ]
    },
    // Dashboard Suggested Alumni
    "priya": {
        name: "Priya Singh",
        role: "Senior Project Manager",
        company: "L&T Construction",
        location: "Mumbai, IN",
        batch: "Class of 2008",
        branch: "Civil Engineering",
        about: "Expert in sustainable urban planning and smart city projects. Led the green corridor initiative in Mumbai.",
        skills: ["Project Management", "Urban Planning", "Sustainability"],
        email: "priya.singh@example.com",
        linkedin: "linkedin.com/in/priyasingh",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq2q0xUpmkPclddU3Aiz6mIH7ear_19MzxTYAbmwwwryA-Jlk-m73f5gtCbLZGnjBSjh8qY6BVGon6g03FaRoY6RZDLXrCS024t5StykElLKmBQcEFGQUYvijF8MOyciQJpHVpFijJyHH0KDOJwHX5VTZawQUAyWsHISZrzlfqKaX5FW7QZi07xnHUOs1WuA1-W_6kbkpm_RsvmGh3plabxjhsUSReAljZ9yjRcA0mIa6O0lPZy5ajf6JoumXaxbmv4nQbgNNXNh8",
        experience: [
            { role: "Senior Project Manager", company: "L&T Construction", duration: "2018 – Present" },
            { role: "Project Lead", company: "Tata Projects", duration: "2012 – 2018" }
        ]
    },
    "rajiv": {
        name: "Rajiv Kapoor",
        role: "CTO",
        company: "TechFlow",
        location: "Bangalore, IN",
        batch: "Class of 1995",
        branch: "Electrical Engineering",
        about: "Tech veteran with over 25 years of experience in scaling startups. Passionate about IoT and hardware innovation.",
        skills: ["Leadership", "IoT", "Hardware Design"],
        email: "rajiv.kapoor@example.com",
        linkedin: "linkedin.com/in/rajivkapoor",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFbki_8MO2_JBUQ01cb6i4ATSlMuIYX4L_4IrxYxda-Y75rSlzdF7AHo0Ikn4Ak3KjAxKOJQ32EMRNnTAbRDJv3gZd2fKA-t60Kz9Ea_XizcUTkAspB0jTohU5yB-GD4hik5AxOi6VylU0a01EraZhspXzzOzoREg3yzioIFDTaI3U8OMz9nJ2wO78PAsqK8rjR5MdjE5pBmsoJhnF-3UfkJspy5-bSB4BAqRpAGivfRLWxjvcx5dwkoaoqHxJs1owlT0aekP7tWU",
        experience: [
            { role: "CTO", company: "TechFlow", duration: "2016 – Present" },
            { role: "VP Engineering", company: "InnoTech", duration: "2010 – 2016" }
        ]
    },
    "sarah": {
        name: "Sarah Jenkins",
        role: "Lead Developer",
        company: "Microsoft",
        location: "Redmond, WA",
        batch: "Class of 2010",
        branch: "Computer Science",
        about: "Full-stack developer with a focus on accessibility and user experience. Advocate for women in tech.",
        skills: ["React", "TypeScript", "Accessibility"],
        email: "sarah.jenkins@example.com",
        linkedin: "linkedin.com/in/sarahjenkins",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuADAS0KeiU3nxRmjV6Od_9SB1Dr5RRbygM2_uXETq0ItCHhlwY2JvMJH-9cUQl_HGEdh4I91joV4pLVnOCgXxMQk-Y78mRQaBNzTXNbzS02HqEzSlQhLvu2yPfBcsf0yfAXG42PqtP2TUaPQCky0A74Q7ZkHmaVk8IoZs8ZY50sFpv2zfwq2W1QL7KiIKqo0wEX-2Ee3gb6TEXYZz07S-QdLNs6rhBfNKInZI06PEShPk2Uw2Tsx79nFhyLgD7umOlNsDCY7veXtEw",
        experience: [
            { role: "Lead Developer", company: "Microsoft", duration: "2019 – Present" },
            { role: "Senior Developer", company: "Salesforce", duration: "2014 – 2019" }
        ]
    },
    "amit": {
        name: "Amit Patel",
        role: "Director of Ops",
        company: "FedEx",
        location: "Memphis, TN",
        batch: "Class of 2002",
        branch: "Mechanical Engineering",
        about: "Operations expert optimizing supply chains globally. Six Sigma Black Belt.",
        skills: ["Supply Chain", "Logistics", "Operations Management"],
        email: "amit.patel@example.com",
        linkedin: "linkedin.com/in/amitpatel",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoKIJyOgWmYN_1RjS2mZdUmLz6U_Rk7oA_FQrGfbeur8wDpsH02Ms7AaS9XcIW25hB2kC0IExtNuBVctIk6l5jbMguPXKOpsl5TOFMqC8hzaP6_2O0G6uifta8-N8CIlCqKgtYEMeXglBAZsYgyAvEx0BLLdVgCHaptr6uHCD0UkGLxeIa9zmqiy7_VfB1JuAhR-8fS1mgv_vHTKjXhIVgYnXN7daeT9hMH1vSPhGoYy69pBkkDbf-jnrD5XBKlk2OxVxBpVVkHZs",
        experience: [
            { role: "Director of Ops", company: "FedEx", duration: "2015 – Present" },
            { role: "Regional Manager", company: "DHL", duration: "2005 – 2015" }
        ]
    }
};
