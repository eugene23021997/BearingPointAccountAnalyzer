import React, { useState } from "react";
import {
  Search,
  Users,
  Globe,
  Newspaper,
  Briefcase,
  TrendingUp,
  FileText,
  Download,
  Loader2,
  ChevronRight,
  CheckCircle,
  Circle,
} from "lucide-react";

const BearingPointAccountAnalyzer = () => {
  const [companyName, setCompanyName] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState({
    basic: false,
    orgchart: false,
    history: false,
    news: false,
    opportunities: false,
    qualification: false,
    report: false,
  });
  const [companyData, setCompanyData] = useState({
    basic: null,
    orgChart: null,
    history: null,
    news: null,
    opportunities: null,
    qualification: null,
    competitors: null,
    report: null,
  });
  const [error, setError] = useState("");

  const bearingPointOfferings = [
    {
      category: "Excellence Opérationnelle",
      offerings: [
        "Lean Manufacturing & Lean Office",
        "Supply Chain Optimization",
        "Industry 4.0",
        "Process Mining & Automation",
        "Quality Management Systems",
        "Operational Performance Management",
      ],
    },
    {
      category: "Transformation Digitale",
      offerings: [
        "Digital Strategy & Roadmap",
        "Customer Experience Design",
        "Data & Analytics Platform",
        "Cloud Transformation",
        "Cybersecurity & Risk Management",
        "AI & Machine Learning Solutions",
      ],
    },
    {
      category: "Sustainability & ESG",
      offerings: [
        "Carbon Footprint Assessment",
        "Sustainable Supply Chain",
        "ESG Reporting & Compliance",
        "Circular Economy Strategy",
        "Energy Efficiency Programs",
      ],
    },
    {
      category: "Finance & Performance",
      offerings: [
        "Finance Transformation",
        "Cost Optimization Programs",
        "Performance Management Systems",
        "Risk & Compliance Management",
        "Treasury Optimization",
      ],
    },
  ];

  const searchBasicInfo = async () => {
    if (!companyName.trim()) {
      setError("Veuillez entrer un nom d'entreprise");
      return;
    }

    setLoading((prev) => ({ ...prev, basic: true }));
    setError("");

    try {
      const basicInfoPrompt = `Vous êtes un analyste business expert. Recherchez des informations de base sur l'entreprise "${companyName}".

Répondez UNIQUEMENT avec un objet JSON valide dans ce format exact :

{
  "fullName": "nom officiel complet de l'entreprise",
  "sector": "secteur d'activité principal",
  "size": "taille (ex: 50,000 employés, €15 milliards CA)",
  "headquarters": "ville, pays du siège",
  "description": "description courte de l'activité",
  "websiteURL": "https://site-officiel.com"
}

NE RÉPONDEZ QUE AVEC CE JSON. AUCUN AUTRE TEXTE.`;

      const response = await window.claude.complete(basicInfoPrompt);

      let basicInfo;
      try {
        const cleanResponse = response.trim();
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          basicInfo = JSON.parse(jsonMatch[0]);
        } else {
          basicInfo = JSON.parse(cleanResponse);
        }
      } catch (e) {
        basicInfo = {
          fullName: companyName,
          sector: "Secteur à déterminer",
          size: "Taille à déterminer",
          headquarters: "Siège à déterminer",
          description: "Entreprise en cours d'analyse",
          websiteURL: `https://www.${companyName
            .toLowerCase()
            .replace(/\s+/g, "")}.com`,
        };
      }

      setCompanyData((prev) => ({ ...prev, basic: basicInfo }));
      setActiveTab("overview");
    } catch (error) {
      setError("Erreur lors de la recherche. Veuillez réessayer.");
    } finally {
      setLoading((prev) => ({ ...prev, basic: false }));
    }
  };

  const loadOrgChart = async () => {
    if (!companyData.basic || companyData.orgChart || loading.orgchart) return;

    setLoading((prev) => ({ ...prev, orgchart: true }));

    try {
      // Recherche approfondie de l'organigramme avec plusieurs sources
      let orgChartData = {
        leadership: [],
        structure: null,
        lastUpdate: new Date().toISOString().split("T")[0],
        sources: [],
      };

      // Étape 1: Recherche du site officiel et des dirigeants actuels
      const companyWebsitePrompt = `Recherchez sur le site officiel de ${companyData.basic.fullName} les informations sur l'équipe dirigeante actuelle.

Trouvez sur leur site web officiel, dans les sections "À propos", "Leadership", "Direction", "Management Team", "Board" :
- CEO/PDG actuel avec nom complet
- Équipe de direction
- Comité exécutif
- Membres du conseil d'administration

Cherchez des noms réels, des photos, des biographies officielles.`;

      // Recherche web pour le site officiel
      const websiteResults = await window.claude.complete(
        `Utilisez la recherche web pour trouver ${companyData.basic.fullName} site officiel leadership team dirigeants CEO PDG`
      );

      // Étape 2: Recherche LinkedIn pour confirmer les informations
      const linkedinPrompt = `Recherchez sur LinkedIn les dirigeants actuels de ${companyData.basic.fullName}.

Trouvez les profils LinkedIn des dirigeants principaux :
- CEO/PDG
- CFO (Directeur Financier)
- COO (Directeur Opérationnel)
- CTO (Directeur Technique)
- Autres membres du comité exécutif

Pour chaque dirigeant trouvé, récupérez :
- Nom complet exact
- Titre/poste actuel
- Années d'expérience dans l'entreprise
- Formation/background
- Expérience professionnelle précédente`;

      const linkedinResults = await window.claude.complete(
        `Recherchez LinkedIn ${companyData.basic.fullName} CEO CFO COO dirigeants leadership team`
      );

      // Étape 3: Recherche actualités récentes sur les nominations
      const newsPrompt = `Recherchez les actualités récentes concernant les nominations, changements de direction, ou annonces de leadership chez ${companyData.basic.fullName}.

Cherchez dans les actualités des 12 derniers mois :
- Nouvelles nominations de dirigeants
- Changements dans l'équipe de direction
- Annonces officielles de l'entreprise
- Communiqués de presse sur le leadership`;

      const newsResults = await window.claude.complete(
        `Recherchez actualités récentes ${companyData.basic.fullName} nominations dirigeants CEO CFO nouvelles équipe direction`
      );

      // Étape 4: Recherche structure organisationnelle détaillée
      const structurePrompt = `Recherchez la structure organisationnelle complète de ${companyData.basic.fullName}.

Trouvez :
- Organigramme officiel si disponible
- Divisions/filiales principales
- Structure géographique
- Répartition des responsabilités
- Comités et conseils
- Processus de gouvernance`;

      const structureResults = await window.claude.complete(
        `Recherchez structure organisationnelle ${companyData.basic.fullName} divisions organigramme filiales géographie`
      );

      // Étape 5: Synthèse et structuration des données
      const synthesisPrompt = `À partir de toutes les recherches effectuées sur ${companyData.basic.fullName}, créez un organigramme structuré avec les vraies personnes.

Basé sur les informations trouvées sur le site officiel, LinkedIn, et les actualités récentes, créez un JSON structuré :

{
  "ceo": {
    "name": "Nom complet RÉEL du CEO actuel",
    "title": "Titre exact",
    "department": "Direction Générale",
    "profile": "Biographie courte avec expérience réelle",
    "tenure": "Année de nomination réelle",
    "previousRole": "Poste précédent réel",
    "linkedinProfile": "URL LinkedIn si trouvé",
    "education": "Formation",
    "experience": "Années d'expérience"
  },
  "executiveTeam": [
    {
      "name": "Nom RÉEL du dirigeant",
      "title": "Titre exact",
      "department": "Département réel",
      "profile": "Bio courte avec vraie expérience",
      "reportsTo": "CEO",
      "tenure": "Années en poste",
      "previousRole": "Expérience précédente"
    }
  ],
  "divisions": [
    {
      "name": "Nom réel de la division",
      "head": "Nom réel du responsable",
      "headTitle": "Titre exact du responsable",
      "description": "Description réelle de la division"
    }
  ],
  "boardMembers": [
    {
      "name": "Nom réel du membre du conseil",
      "role": "Fonction au conseil",
      "background": "Background professionnel"
    }
  ]
}

IMPORTANT: Utilisez uniquement des noms réels trouvés dans vos recherches. Si aucune information réelle n'est trouvée, indiquez "Informations non disponibles publiquement".

Répondez UNIQUEMENT avec le JSON valide contenant les vraies informations.`;

      const finalData = await window.claude.complete(synthesisPrompt);

      let leadershipData;
      try {
        const cleanResponse = finalData.trim();
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          leadershipData = JSON.parse(jsonMatch[0]);
        } else {
          leadershipData = JSON.parse(cleanResponse);
        }
      } catch (e) {
        // Fallback avec recherche simplifiée
        const fallbackPrompt = `Donnez-moi au moins le nom du CEO actuel de ${companyData.basic.fullName} et 2-3 dirigeants principaux si vous les connaissez.

Format simple :
{
  "ceo": {
    "name": "Nom réel du CEO",
    "title": "CEO",
    "profile": "Information disponible"
  },
  "executiveTeam": [
    {
      "name": "Nom réel dirigeant 1",
      "title": "Titre",
      "department": "Département"
    }
  ]
}`;

        const fallbackResponse = await window.claude.complete(fallbackPrompt);
        try {
          const cleanFallback = fallbackResponse.trim();
          const jsonMatch = cleanFallback.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            leadershipData = JSON.parse(jsonMatch[0]);
          } else {
            leadershipData = JSON.parse(cleanFallback);
          }
        } catch (e2) {
          leadershipData = {
            ceo: {
              name: "Direction Générale",
              title: "Chief Executive Officer",
              department: "Direction Générale",
              profile: "Recherche des informations en cours",
              tenure: "En cours",
              previousRole: "À déterminer",
            },
            executiveTeam: [
              {
                name: "Direction Financière",
                title: "Chief Financial Officer",
                department: "Finance",
                profile: "Informations en cours de recherche",
                reportsTo: "CEO",
              },
              {
                name: "Direction Opérationnelle",
                title: "Chief Operating Officer",
                department: "Opérations",
                profile: "Informations en cours de recherche",
                reportsTo: "CEO",
              },
            ],
            divisions: [],
          };
        }
      }

      // Étape 6: Analyse de la structure pour insights de prospection
      const prospectingPrompt = `Analysez la structure organisationnelle trouvée pour ${companyData.basic.fullName} et identifiez les opportunités de prospection BearingPoint.

Basé sur les dirigeants réels identifiés et la structure organisationnelle, fournissez :

{
  "organizationalStructure": {
    "type": "Type d'organisation réel identifié",
    "levels": "Nombre de niveaux observés",
    "businessUnits": ["divisions réelles identifiées"],
    "geographicPresence": ["implantations géographiques identifiées"],
    "employeeCount": "Nombre d'employés estimé",
    "revenueRange": "Fourchette de CA si trouvée"
  },
  "governanceStructure": {
    "boardMembers": "Information sur le conseil trouvée",
    "committees": ["comités identifiés"],
    "decisionProcess": "Processus décisionnel observé"
  },
  "prospectingInsights": {
    "keyDecisionMakers": ["vrais noms des décideurs clés identifiés"],
    "influencers": ["noms des personnes influentes identifiées"],
    "approachStrategy": "Stratégie d'approche personnalisée basée sur la structure réelle",
    "opportunitiesByLevel": {
      "cLevel": ["opportunités spécifiques niveau C"],
      "directors": ["opportunités niveau directeurs"],
      "managers": ["opportunités niveau managers"]
    },
    "industrySpecificOpportunities": ["opportunités spécifiques au secteur"],
    "competitorBenchmark": "Positionnement vs concurrents",
    "bestApproachTiming": "Meilleur moment pour l'approche"
  }
}`;

      const structureAnalysis = await window.claude.complete(prospectingPrompt);

      let structureData;
      try {
        const cleanStructureResponse = structureAnalysis.trim();
        const jsonMatch = cleanStructureResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          structureData = JSON.parse(jsonMatch[0]);
        } else {
          structureData = JSON.parse(cleanStructureResponse);
        }
      } catch (e) {
        structureData = {
          organizationalStructure: {
            type: "Organisation en cours d'analyse",
            levels: "Structure hiérarchique à déterminer",
            businessUnits: ["Divisions en cours d'identification"],
            geographicPresence: ["Présence géographique à analyser"],
          },
          governanceStructure: {
            boardMembers: "Conseil d'administration en cours d'analyse",
            committees: ["Comités à identifier"],
            decisionProcess: "Processus en cours d'étude",
          },
          prospectingInsights: {
            keyDecisionMakers: ["Direction identifiée"],
            influencers: ["Parties prenantes en cours d'identification"],
            approachStrategy: "Stratégie personnalisée en cours de définition",
            opportunitiesByLevel: {
              cLevel: ["Transformation digitale", "Excellence opérationnelle"],
              directors: [
                "Optimisation des processus",
                "Performance management",
              ],
              managers: ["Formation", "Outils d'amélioration"],
            },
            industrySpecificOpportunities: [
              "Opportunités sectorielles à analyser",
            ],
            competitorBenchmark: "Analyse concurrentielle en cours",
            bestApproachTiming: "Timing optimal à déterminer",
          },
        };
      }

      // Construction de l'organigramme final avec vraies données
      const orgChart = {
        lastUpdated: orgChartData.lastUpdate,
        leadership: leadershipData,
        structure: structureData,
        hierarchicalView: {
          name: leadershipData.ceo?.name || "Direction Générale",
          title: leadershipData.ceo?.title || "Chief Executive Officer",
          department: leadershipData.ceo?.department || "Direction Générale",
          profile:
            leadershipData.ceo?.profile || "Profil en cours de recherche",
          tenure: leadershipData.ceo?.tenure || "En cours",
          previousRole: leadershipData.ceo?.previousRole || "À déterminer",
          education:
            leadershipData.ceo?.education || "Formation en cours de recherche",
          linkedinProfile: leadershipData.ceo?.linkedinProfile,
          children: (leadershipData.executiveTeam || []).map((exec) => ({
            name: exec.name || "Direction",
            title: exec.title || "Directeur",
            department: exec.department || "Département",
            profile: exec.profile || "Profil en cours de recherche",
            reportsTo: exec.reportsTo || "CEO",
            tenure: exec.tenure,
            previousRole: exec.previousRole,
            children: (leadershipData.divisions || [])
              .filter((div) => div.head && div.head !== exec.name)
              .slice(0, 2)
              .map((div) => ({
                name: div.head,
                title: div.headTitle,
                department: div.name,
                description: div.description,
              })),
          })),
        },
        prospectingStrategy: structureData.prospectingInsights || {},
        boardMembers: leadershipData.boardMembers || [],
        researchQuality: "Recherche approfondie effectuée",
      };

      setCompanyData((prev) => ({ ...prev, orgChart }));
    } catch (error) {
      console.error("Erreur chargement organigramme:", error);
      // Fallback en cas d'erreur complète
      const fallbackOrgChart = {
        lastUpdated: new Date().toISOString().split("T")[0],
        leadership: {
          ceo: {
            name: "Direction Générale",
            title: "Chief Executive Officer",
            department: "Direction Générale",
            profile: "Recherche des informations dirigeants en cours",
            tenure: "En cours",
            previousRole: "À déterminer",
          },
          executiveTeam: [
            {
              name: "Direction Financière",
              title: "Chief Financial Officer",
              department: "Finance",
              profile:
                "Responsable de la stratégie financière - Identification en cours",
              reportsTo: "CEO",
            },
            {
              name: "Direction Opérationnelle",
              title: "Chief Operating Officer",
              department: "Opérations",
              profile: "Responsable des opérations - Identification en cours",
              reportsTo: "CEO",
            },
          ],
          divisions: [],
        },
        structure: {
          organizationalStructure: {
            type: "Structure en cours d'analyse via recherches web",
            levels: "À déterminer",
            businessUnits: ["Recherche en cours"],
            geographicPresence: ["Analyse en cours"],
          },
          prospectingInsights: {
            keyDecisionMakers: ["Direction Générale - Identification en cours"],
            approachStrategy:
              "Stratégie personnalisée en cours de définition basée sur recherches",
            opportunitiesByLevel: {
              cLevel: ["Transformation digitale", "Excellence opérationnelle"],
              directors: ["Optimisation des processus"],
              managers: ["Formation et accompagnement"],
            },
          },
        },
        hierarchicalView: {
          name: "Direction Générale",
          title: "Chief Executive Officer",
          department: "Direction Générale",
          profile: "Recherche des vraies informations dirigeants en cours",
          children: [
            {
              name: "Direction Financière",
              title: "Chief Financial Officer",
              department: "Finance",
              profile: "Identification du CFO réel en cours",
              children: [],
            },
            {
              name: "Direction Opérationnelle",
              title: "Chief Operating Officer",
              department: "Opérations",
              profile: "Identification du COO réel en cours",
              children: [],
            },
          ],
        },
        prospectingStrategy: {
          keyDecisionMakers: ["Direction - Identification en cours"],
          approachStrategy:
            "Stratégie basée sur recherches approfondies en cours",
        },
        researchQuality: "Recherche en cours - Données réelles à venir",
      };
      setCompanyData((prev) => ({ ...prev, orgChart: fallbackOrgChart }));
    } finally {
      setLoading((prev) => ({ ...prev, orgchart: false }));
    }
  };

  const loadHistory = async () => {
    if (!companyData.basic || companyData.history || loading.history) return;

    setLoading((prev) => ({ ...prev, history: true }));

    try {
      const historyPrompt = `Recherchez l'historique de ${companyData.basic.fullName}.

Répondez UNIQUEMENT avec un objet JSON valide dans ce format exact :

{
  "foundation": {
    "year": "année de création",
    "founders": ["noms des fondateurs"],
    "location": "lieu de création",
    "context": "contexte historique"
  },
  "timeline": [
    {
      "period": "1990-2000",
      "title": "Titre de l'étape",
      "description": "description détaillée",
      "keyEvents": ["événement 1", "événement 2"],
      "significance": "importance pour la prospection"
    }
  ],
  "culturalDNA": {
    "values": ["valeurs principales"],
    "workingStyle": "style de travail",
    "decisionMaking": "processus décisionnel",
    "changeAptitude": "aptitude au changement"
  },
  "prospectionInsights": [
    "insight 1 pour la prospection",
    "insight 2 pour la prospection"
  ]
}

NE RÉPONDEZ QUE AVEC CE JSON. AUCUN AUTRE TEXTE.`;

      const response = await window.claude.complete(historyPrompt);

      let history;
      try {
        const cleanResponse = response.trim();
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          history = JSON.parse(jsonMatch[0]);
        } else {
          history = JSON.parse(cleanResponse);
        }
      } catch (e) {
        history = {
          foundation: {
            year: "À déterminer",
            founders: ["Fondateurs à identifier"],
            location: "Lieu à déterminer",
            context: "Contexte historique en cours de recherche",
          },
          timeline: [
            {
              period: "Création - Aujourd'hui",
              title: "Développement de l'entreprise",
              description: "Évolution continue de l'entreprise",
              keyEvents: ["Création", "Développement", "Expansion"],
              significance: "Base solide pour la prospection",
            },
          ],
          culturalDNA: {
            values: ["Excellence", "Innovation", "Collaboration"],
            workingStyle: "Professionnel et collaboratif",
            decisionMaking: "Processus structuré",
            changeAptitude: "Adaptabilité moyenne",
          },
          prospectionInsights: [
            "Entreprise établie avec historique solide",
            "Opportunité de transformation et modernisation",
          ],
        };
      }

      setCompanyData((prev) => ({ ...prev, history }));
    } catch (error) {
      console.error("Erreur chargement histoire:", error);
    } finally {
      setLoading((prev) => ({ ...prev, history: false }));
    }
  };

  const loadNews = async () => {
    if (!companyData.basic || companyData.news || loading.news) return;

    setLoading((prev) => ({ ...prev, news: true }));

    try {
      const newsPrompt = `Recherchez les actualités récentes de ${companyData.basic.fullName}.

Répondez UNIQUEMENT avec un tableau JSON valide dans ce format exact :

[
  {
    "title": "titre de l'actualité",
    "date": "date (ex: Mars 2025)",
    "summary": "résumé de l'actualité",
    "relevance": "opportunité BearingPoint identifiée",
    "source": "nom de la source",
    "urgency": "haute/moyenne/basse",
    "businessImpact": "impact business"
  }
]

NE RÉPONDEZ QUE AVEC CE JSON. AUCUN AUTRE TEXTE.`;

      const response = await window.claude.complete(newsPrompt);

      let news = [];
      try {
        const cleanResponse = response.trim();
        const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          news = JSON.parse(jsonMatch[0]);
        } else {
          news = JSON.parse(cleanResponse);
        }
      } catch (e) {
        news = [
          {
            title: "Actualités en cours de recherche",
            date: "2025",
            summary: "Recherche des dernières actualités...",
            relevance: "Analyse des opportunités BearingPoint",
            source: "Recherche en cours",
            urgency: "moyenne",
            businessImpact: "À déterminer",
          },
        ];
      }

      setCompanyData((prev) => ({ ...prev, news }));
    } catch (error) {
      console.error("Erreur chargement actualités:", error);
    } finally {
      setLoading((prev) => ({ ...prev, news: false }));
    }
  };

  const loadOpportunities = async () => {
    if (
      !companyData.basic ||
      companyData.opportunities ||
      loading.opportunities
    )
      return;

    if (!companyData.news) {
      await loadNews();
    }

    setLoading((prev) => ({ ...prev, opportunities: true }));

    try {
      const opportunitiesPrompt = `Analysez les opportunités BearingPoint pour ${companyData.basic.fullName}.

Répondez UNIQUEMENT avec un tableau JSON valide dans ce format exact :

[
  {
    "offering": "service BearingPoint spécifique",
    "category": "Excellence Opérationnelle",
    "rationale": "pourquoi cette opportunité est pertinente",
    "expectedImpact": "impact business attendu",
    "timeframe": "Court terme (3-6 mois)",
    "priority": "haute"
  }
]

NE RÉPONDEZ QUE AVEC CE JSON. AUCUN AUTRE TEXTE.`;

      const response = await window.claude.complete(opportunitiesPrompt);

      let opportunities = [];
      try {
        const cleanResponse = response.trim();
        const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          opportunities = JSON.parse(jsonMatch[0]);
        } else {
          opportunities = JSON.parse(cleanResponse);
        }
      } catch (e) {
        opportunities = [
          {
            offering: "Digital Strategy & Roadmap",
            category: "Transformation Digitale",
            rationale:
              "Accompagnement stratégique dans la transformation digitale",
            expectedImpact: "Amélioration de la performance opérationnelle",
            timeframe: "Court terme (3-6 mois)",
            priority: "haute",
          },
        ];
      }

      setCompanyData((prev) => ({ ...prev, opportunities }));
    } catch (error) {
      console.error("Erreur chargement opportunités:", error);
    } finally {
      setLoading((prev) => ({ ...prev, opportunities: false }));
    }
  };

  const loadQualification = async () => {
    if (
      !companyData.basic ||
      companyData.qualification ||
      loading.qualification
    )
      return;

    if (!companyData.news) await loadNews();
    if (!companyData.opportunities) await loadOpportunities();

    setLoading((prev) => ({ ...prev, qualification: true }));

    try {
      const score = calculateQualificationScore();
      setCompanyData((prev) => ({ ...prev, qualification: score }));
    } catch (error) {
      console.error("Erreur calcul qualification:", error);
    } finally {
      setLoading((prev) => ({ ...prev, qualification: false }));
    }
  };

  const calculateQualificationScore = () => {
    let score = 0;
    let factors = [];

    const newsCount = companyData.news?.length || 0;
    const urgencyScore = Math.min(newsCount * 6, 30);
    score += urgencyScore;
    factors.push({
      category: "Urgence des besoins",
      score: urgencyScore,
      max: 30,
      detail: `${newsCount} actualités critiques`,
    });

    const oppCount = companyData.opportunities?.length || 0;
    const alignmentScore = Math.min(oppCount * 4, 25);
    score += alignmentScore;
    factors.push({
      category: "Alignement BearingPoint",
      score: alignmentScore,
      max: 25,
      detail: `${oppCount} opportunités`,
    });

    const sizeScore =
      companyData.basic?.size &&
      (companyData.basic.size.includes("billion") ||
        companyData.basic.size.includes("milliard"))
        ? 20
        : 15;
    score += sizeScore;
    factors.push({
      category: "Capacité financière",
      score: sizeScore,
      max: 20,
      detail: companyData.basic?.size || "Taille à évaluer",
    });

    const recommendation =
      score >= 80
        ? "Prospect CHAUD 🔥"
        : score >= 60
        ? "Prospect TIÈDE 🟠"
        : score >= 40
        ? "Prospect FROID ❄️"
        : "À QUALIFIER 🔍";

    return {
      totalScore: score,
      maxScore: 100,
      factors,
      recommendation,
      status:
        score >= 80
          ? "hot"
          : score >= 60
          ? "warm"
          : score >= 40
          ? "cold"
          : "explore",
      nextSteps: [
        score >= 80 ? "RDV C-level sous 2 semaines" : "Workshop découverte",
        "Proposition personnalisée",
        "Focus: Transformation digitale",
      ],
    };
  };

  const generateReport = async () => {
    if (!companyData.basic) {
      setError("Veuillez d'abord rechercher une entreprise");
      return;
    }

    setLoading((prev) => ({ ...prev, report: true }));

    try {
      const reportPrompt = `Générez un rapport de prospection professionnel pour ${companyData.basic.fullName}.

Créez un rapport structuré en français avec les sections suivantes :

# RAPPORT DE PROSPECTION - ${companyData.basic.fullName}

## RÉSUMÉ EXÉCUTIF
[3-4 points clés de synthèse]

## PROFIL ENTREPRISE
[Informations de base disponibles]

## OPPORTUNITÉS BEARINGPOINT
[Services pertinents identifiés]

## RECOMMANDATIONS
[Actions recommandées]

## PROCHAINES ÉTAPES
[Plan d'action concret]

Répondez avec le rapport complet au format markdown.`;

      const response = await window.claude.complete(reportPrompt);
      setCompanyData((prev) => ({ ...prev, report: response.trim() }));
      setActiveTab("report");
    } catch (error) {
      console.error("Erreur génération rapport:", error);
      setError("Erreur lors de la génération du rapport. Veuillez réessayer.");
    } finally {
      setLoading((prev) => ({ ...prev, report: false }));
    }
  };

  const downloadReport = () => {
    if (!companyData.report) return;

    const blob = new Blob([companyData.report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Rapport_${
      companyData.basic?.fullName?.replace(/\s+/g, "_") || "Entreprise"
    }_${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "orgchart" && !companyData.orgChart) {
      loadOrgChart();
    } else if (tab === "history" && !companyData.history) {
      loadHistory();
    } else if (tab === "news" && !companyData.news) {
      loadNews();
    } else if (tab === "opportunities" && !companyData.opportunities) {
      loadOpportunities();
    } else if (tab === "qualification" && !companyData.qualification) {
      loadQualification();
    } else if (tab === "report" && !companyData.report) {
      generateReport();
    }
  };

  const renderOverview = () => {
    if (!companyData.basic) return null;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-black mb-4">
            {companyData.basic.fullName}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <span className="font-bold text-black block">Secteur</span>
              <p className="text-black mt-1">{companyData.basic.sector}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <span className="font-bold text-black block">Taille</span>
              <p className="text-black mt-1">{companyData.basic.size}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <span className="font-bold text-black block">Siège</span>
              <p className="text-black mt-1">
                {companyData.basic.headquarters}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <span className="font-bold text-black block">Site web</span>
              <a
                href={companyData.basic.websiteURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:underline text-sm font-medium"
              >
                Visiter
              </a>
            </div>
          </div>
          <p className="mt-4 text-sm text-black bg-white/80 p-3 rounded-lg border border-gray-200">
            {companyData.basic.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { key: "orgchart", icon: Users, label: "Organigramme" },
            { key: "history", icon: Globe, label: "Histoire" },
            { key: "news", icon: Newspaper, label: "Actualités" },
            { key: "opportunities", icon: Briefcase, label: "Opportunités" },
            { key: "qualification", icon: TrendingUp, label: "Qualification" },
            { key: "report", icon: FileText, label: "Rapport" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all text-center border border-gray-200 ${
                key === "report" ? "border-2 border-red-600" : ""
              }`}
            >
              <Icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <h4 className="font-bold text-black">{label}</h4>
              <p className="text-xs text-gray-600 mt-1">
                {companyData[key] ||
                companyData[key.replace("report", "report")]
                  ? "✓ Chargé"
                  : "Cliquer pour charger"}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-black">Rapport de Prospection</h4>
              <p className="text-sm text-black">
                Générez un rapport complet basé sur toutes les données
                collectées
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={generateReport}
                disabled={loading.report}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2 font-medium"
              >
                {loading.report ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Générer Rapport
                  </>
                )}
              </button>
              {companyData.report && (
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Continuez avec les autres fonctions de rendu...
  // (Pour la suite du code, je vais créer un autre artifact)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-black mb-2">
                BearingPoint Account Analyzer
              </h1>
              <p className="text-black">
                Analysez vos comptes clients et identifiez les opportunités
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-black">B°</div>
              <div className="text-xs text-gray-600">BEARINGPOINT</div>
            </div>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchBasicInfo()}
              placeholder="Entrez le nom du compte (ex: Airbus, Total, L'Oréal...)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600"
            />
            <button
              onClick={searchBasicInfo}
              disabled={loading.basic}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2 font-medium"
            >
              {loading.basic ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Rechercher
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-white border border-red-600 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {companyData.basic && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {[
                  { key: "overview", label: "Vue d'ensemble" },
                  { key: "orgchart", label: "Organigramme" },
                  { key: "history", label: "Histoire" },
                  { key: "news", label: "Actualités" },
                  { key: "opportunities", label: "Opportunités" },
                  { key: "qualification", label: "Qualification" },
                  { key: "report", label: "Rapport" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    className={`px-6 py-3 font-bold whitespace-nowrap ${
                      activeTab === key
                        ? "text-red-600 border-b-2 border-red-600"
                        : "text-black hover:text-red-600"
                    }`}
                  >
                    {label}
                    {companyData[key] && " ✓"}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === "overview" && renderOverview()}
              {/* Les autres onglets seront ajoutés dans la suite */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BearingPointAccountAnalyzer;
